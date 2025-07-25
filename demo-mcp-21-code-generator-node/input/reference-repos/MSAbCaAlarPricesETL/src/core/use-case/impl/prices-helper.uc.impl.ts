/**
 * Clase para la construcción del orquestador para todos los flujos
 * @author Daniel C Rubiano R
 */
import { Injectable } from '@nestjs/common';
import Logging from '../../../common/lib/logging';
import {
  ETaskDesc,
  ETaskPrices,
  Etask,
} from '../../../common/utils/enums/taks.enum';
import { FamilyParams } from '../../../common/utils/enums/params.enum';
import { IPricesProvider } from '../../../data-provider/prices.provider';
import { IPricesHelper } from '../prices-helper.uc';
import {
  Page,
  GetProductOfferingResponse,
  LastPrices,
} from '../../entity/prices/product-offering-prices.entity';
import {
  PriceListBuilder,
  Prices,
} from '../../entity/prices/price-list.entity';
import {
  PopTypeEnum,
  PricesFamily,
} from '../../../common/utils/enums/prices.enum';
import Traceability from '../../../common/lib/traceability';
import util from '../../../common/utils/generalUtil';
import { ELevelsErros } from '../../../common/utils/enums/logging.enum';
import { EStatusTracingGeneral } from '../../../common/utils/enums/tracing.enum';
import { IProductOfferingProvider } from '../../../data-provider/product-offering.provider';
import { IEquipmentProvider } from '../../../data-provider/equipment.provider';
import { ITechnologyProvider } from '../../../data-provider/technology.provider';
import { IServiceErrorUc } from '../resource/service-error.resource.uc';
import { IServiceTracingUc } from '../resource/service-tracing.resource.uc';
import { ParamUcimpl } from '../resource/impl/param.resource.uc.impl';
import { IListNamesByFamily } from '../../../core/entity/param/param.entity';

@Injectable()
export class PricesHelperUcImpl implements IPricesHelper {
  private readonly logger = new Logging(PricesHelperUcImpl.name);

  constructor(
    private readonly _pricesProvider: IPricesProvider,
    private readonly _productOfferingProvider: IProductOfferingProvider,
    private readonly _equipmentProvider: IEquipmentProvider,
    private readonly _technologyProvider: ITechnologyProvider,
    private readonly _serviceTracing: IServiceTracingUc,
    private readonly _serviceError: IServiceErrorUc,
  ) {}

  /**
   * Función inicial de orquestación para los diferentes flujos
   * @param {FamilyParams} family nombre de la coleccion
   */
  async pricesHelper(family: FamilyParams): Promise<any> {
    try {
      const dataCatalog = await this.getProductOfferingData(family);

      if (!dataCatalog || dataCatalog.length === 0) {
        this.logger.write(
          'PricesHelperUcImpl()',
          ETaskPrices.ERROR_GET_DATA_CATALOG,
          ELevelsErros.WARNING,
        );
        return;
      }

      await this.deleteDataByCollection(family);

      this.logger.write(
        `${ ETaskDesc.START_FLOW_TO_SAVE_DATA} lastPrices - ${family}`,
        ETaskDesc.START_FLOW_TO_SAVE_DATA,
        ELevelsErros.INFO,
      );

      for (let page of dataCatalog) {
        const productOfferingResponse = page.data.getProductOfferingResponse;

        await this.pricesProcess(productOfferingResponse, family);

        await this.createTraceability(
          EStatusTracingGeneral.STATUS_SUCCESS,
          `Finalizo en la pagina,${page.params.page}` as ETaskDesc,
          'PricesHelperUcImpl()' as Etask,
        );
      }
    } catch (error) {
      await this.createServiceError(
        `pricesHelper() -> ${family}`,
        ETaskPrices.ERROR_SERVICE,
        error,
      );
    }
  }

  /**
   * Lógica de negocio para obtener la data de product offering
   * @param filter Filtro con el que se busca la data
   */
  private async getProductOfferingData(family: FamilyParams): Promise<Page[]> {
    let dataCatalog: Page[];
    const START_TIME = process.hrtime();
    
    await this.createTraceability(
      EStatusTracingGeneral.STATUS_SUCCESS,
      ETaskDesc.START_GET_DATA_PRODUCT_OFFERING,
      Etask.GET_PRODUCT_OFFERING_DATA,
      ELevelsErros.INFO,
      +START_TIME
    );
    dataCatalog = await this._productOfferingProvider.getData(family);
    await this.createTraceability(
      EStatusTracingGeneral.STATUS_SUCCESS,
      ETaskDesc.FINISH_GET_DATA_PRODUCT_OFFERING,
      Etask.GET_PRODUCT_OFFERING_DATA,
      ELevelsErros.INFO,
      util.processExecutionTime(START_TIME)
    );
    return dataCatalog;
  }

  /**
   * Lógica de negocio para el flujo de terminales
   * @param productOfferingResponse Contenido de la respuesta del servicio Valgenerate
   */
  private async pricesProcess(
    productOfferingResponse: GetProductOfferingResponse[],
    familyParams: FamilyParams,
  ): Promise<any> {
    try {
      let allPrices: Prices[] = [];

      for (const getProductOfferingResponse of productOfferingResponse) {
        const family = getProductOfferingResponse.versions[0]
          .family as PricesFamily;

        const lastPricesTT = await this.lastPrice(
          getProductOfferingResponse,
          family,
        );
        const prices = this.createDataToSave(
          getProductOfferingResponse,
          lastPricesTT,
          family,
        );
        allPrices.push(...prices);
      }
      await this.orchastratorToSaveData(allPrices, familyParams);
    } catch (error) {
      await this.createServiceError(
        `Error To save data in ${familyParams}`,
        ETaskPrices.ERROR_TO_SAVE_DATA,
        error,
      );
    }
  }

  /**
   * Lógica para Crear la data dependiendo del family type
   * @param getProductOfferingResponse Contenido de la respuesta del servicio product Offering
   * @param lastPricesTT Ultimos precios registrados
   * @param family Tipo de family que se quiere tomar la data
   */
  private createDataToSave(
    getProductOfferingResponse: GetProductOfferingResponse,
    lastPricesTT: LastPrices,
    family: PricesFamily,
  ): Prices[] {
    let prices: Prices[] = [];

    const listPricesToCreate = ParamUcimpl.getMessages[0];

    for (const listPrices of listPricesToCreate.values) {
      const isFamilyAvailable = listPrices.status;
      const isFamilyflow = listPrices.family == family;
      if (isFamilyflow && isFamilyAvailable) {
        prices.push(
          ...this.createEntitiesByListName(
            listPrices,
            getProductOfferingResponse,
            lastPricesTT,
          ),
        );
      }
    }
    return prices;
  }

  /**
   * Lógica para obtener los precios del PopType de la data tomada de product Offering
   * @param {GetProductOfferingResponse} getProductOfferingResponse Contenido de la respuesta del servicio product Offering
   * @param {IListNamesByFamily} listPrices Nombre del PopType que se quiere tomar el precio
   */
  private createEntitiesByListName(
    listPrices: IListNamesByFamily,
    getProductOfferingResponse: GetProductOfferingResponse,
    lastPricesTT: LastPrices,
  ): Prices[] {
    let prices: Prices[] = [];

    for (const listName of listPrices.listNames) {
      const isListNameAvailable = listName.status;
      if (isListNameAvailable) {
        const priceInCop = listName.priceBefore
          ? lastPricesTT.extendedSitesCatalogAssetStoreList
          : this.getPriceByPopType(
              getProductOfferingResponse,
              listName.popType as PopTypeEnum,
            );
        const precioClienteClaro = new PriceListBuilder()
          .setPriceListName(listName.name)
          .setCatentryPartNumber(getProductOfferingResponse.id)
          .setPriceInCOP(priceInCop.toString())
          .build();

        prices.push(precioClienteClaro);
      }
    }
    return prices;
  }

  /**
   * Lógica para obtener los precios del PopType de la data tomada de product Offering
   * @param productOfferingResponse Contenido de la respuesta del servicio product Offering
   * @param popTypeToRequest Nombre del PopType que se quiere tomar el precio
   */
  private getPriceByPopType(
    getProductOfferingResponse: GetProductOfferingResponse,
    popTypeToRequest: PopTypeEnum,
  ): number {
    const version = getProductOfferingResponse.versions[0];
    const productOfferingPrice = version.productOfferingPrices[0];
    const priceObject = productOfferingPrice.versions.find(
      ({ popType }) => popType === popTypeToRequest,
    );

    return priceObject ? priceObject.price.amount || 0 : 0;
  }

  /**
   * Lógica de negocio para el flujo de terminales(Precio ahora - precio antes)
   * @param productOfferingResponse Contenido de la respuesta del servicio Valgenerate
   */
  private async lastPrice(
    productOfferingResponse: GetProductOfferingResponse,
    family: PricesFamily,
  ): Promise<LastPrices> {
    // Case 1: First Execution
    const lastPricesTT: LastPrices = {
      CatentryPartNumber: productOfferingResponse.id,
      extendedSitesCatalogAssetStoreList: '0', // Precio antes
      extendedSitesCatalogAssetStore: this.getPriceByPopType(
        productOfferingResponse,
        PopTypeEnum.precioVentaOneTime,
      ).toString(),
      family,
    };

    try {
      const filter = productOfferingResponse.id;
      const findResult: LastPrices | undefined =
        await this._pricesProvider.findLastPrices(filter, family);

      if (findResult) {
        const precioAhoraEnBd = +findResult.extendedSitesCatalogAssetStore;
        const precioQueLlega = +lastPricesTT.extendedSitesCatalogAssetStore;

        // Case 2
        if (
          precioQueLlega < precioAhoraEnBd ||
          precioQueLlega > precioAhoraEnBd
        ) {
          lastPricesTT.extendedSitesCatalogAssetStoreList =
            findResult.extendedSitesCatalogAssetStore;
          lastPricesTT.extendedSitesCatalogAssetStore =
            precioQueLlega.toString();
        }

        // Caso 3
        if (precioQueLlega === precioAhoraEnBd) {
          lastPricesTT.extendedSitesCatalogAssetStoreList =
            findResult.extendedSitesCatalogAssetStoreList;
          lastPricesTT.extendedSitesCatalogAssetStore =
            findResult.extendedSitesCatalogAssetStore;
        }
      }

      await this._pricesProvider.saveDataLastPrices(filter, lastPricesTT);
    } catch (error) {
      await this.createServiceError(
        `lastPrice() error:`,
        ETaskPrices.ERROR_PRICE_PROCESSLASTPRICESUC,
        error,
      );
    }

    return lastPricesTT;
  }

  /**
   * Lógica de negocio para guardar la data en las diferentes coleccion
   * @param collectionName Nombre de la colección que se quiere guardar
   * @param prices Data que se quiere guardar
   */
  private async orchastratorToSaveData(
    prices: Prices[],
    familyParams: FamilyParams,
  ): Promise<any> {
    if (familyParams === FamilyParams.equipment) {
      return this._equipmentProvider.insertMany(prices);
    }
    if (familyParams === FamilyParams.technology) {
      return this._technologyProvider.insertMany(prices);
    }
  }

  /**
   * Lógica de negocio para limpiar/borrar la data en las diferentes coleccion
   * @param collectionName Nombre de la colección que se quiere borrar
   */
  private async orchastratorToDeleteData(family: FamilyParams): Promise<any> {
    if (family === FamilyParams.equipment) {
      return this._equipmentProvider.deleteAll();
    }
    if (family === FamilyParams.technology) {
      return this._technologyProvider.deleteAll();
    }
  }

  /**
   * Lógica de negocio para limpiar/borrar la data en las diferentes coleccion
   * @param collectionName Nombre de la colección que se quiere borrar
   */
  private async deleteDataByCollection(family: FamilyParams): Promise<any> {
    try {
      const START_TIME = process.hrtime();
      this.logger.write(
        ETaskDesc.START_DELETE_DATA,
        `${ETaskDesc.START_DELETE_DATA} for -> ${family}` as ETaskDesc,
        ELevelsErros.INFO,
        START_TIME
      );
      await this.orchastratorToDeleteData(family);
      await this.createTraceability(
        EStatusTracingGeneral.STATUS_SUCCESS,
        `${ETaskDesc.FINISH_DELETE_DATA} for -> ${family}` as ETaskDesc,
        Etask.DELETE_DATA,
        ELevelsErros.INFO,
        util.processExecutionTime(START_TIME)
      );
    } catch (error) {
      await this.createServiceError(
        `Error para borrar la data en ${family}`,
        ETaskPrices.ERROR_TO_DELETE_DATA,
        error,
      );
    }
  }

  /**
   * Lógica para crear service traciability
   * @param description Descripcion
   * @param task tarea
   */
  private async createTraceability(
    status: EStatusTracingGeneral,
    description: ETaskDesc | string,
    task: Etask,
    level?: ELevelsErros,
    processingTime?: number
  ): Promise<void> {
    const traceability = new Traceability({});
    traceability.setStatus(EStatusTracingGeneral.STATUS_SUCCESS);
    traceability.setDescription(description);
    traceability.setTask(description);
    traceability.setTransactionId(util.getCorrelationalId);
    await this._serviceTracing.createServiceTracing(
      traceability.getTraceability(),
      level,
      processingTime
    );
  }
  /**
   * Lógica para crear service error
   * @param origen Origen del error
   * @param description Descripcion
   * @param error error
   */
  private async createServiceError(
    origen: string,
    description: ETaskPrices,
    error: any,
  ): Promise<void> {
    const objectTask = {
      origen,
      message: description,
      stack: error,
    };

    await this._serviceError.createServiceError(error, objectTask as any);
  }
}
