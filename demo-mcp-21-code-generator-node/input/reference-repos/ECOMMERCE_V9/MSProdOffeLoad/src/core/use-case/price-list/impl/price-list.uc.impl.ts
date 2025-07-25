/**
 * Clase para construcción logica de negocio metodo creación dataload price-list
 * @autor Santiago Vargas
 */

import { Injectable } from '@nestjs/common';
import generalConfig from '../../../../common/configuration/general.config';
import Logging from '../../../../common/lib/logging';
import find from '../../../../common/utils/UtilConfig';
import CreateCsv from '../../../../common/utils/createCsv';
import { ECategoriesDataload } from '../../../../common/utils/enums/categories-dataload.enum';
import { ETaskDesc, Etask } from '../../../../common/utils/enums/taks.enum';
import { IPriceList } from '../../../../core/entity/catalog/price-list.entity';
import { IDataloadProviderPrices } from '../../../../data-provider/dataload-prices.provider';
import { IDataloadProvider } from '../../../../data-provider/dataload.provider';
import { ISftpProvider } from '../../../../data-provider/sftp.provider';
import { IServiceErrorUc } from '../../resource/service-error.resource.uc';
import { IServiceTracingUc } from '../../resource/service-tracing.resource.uc';
import { IPriceListUC } from '../price-list.uc';
import { IParents } from '../../../entity/catalog/catalog.entity';
import { ELevelsErros } from '../../../../common/utils/enums/logging.enum';

@Injectable()
export class PriceListUC implements IPriceListUC {
  constructor(
    private sftpProvider: ISftpProvider,
    private dataloadProvider: IDataloadProvider,
    private dataloadProviderPrices: IDataloadProviderPrices,
    public readonly _serviceError: IServiceErrorUc,
    public readonly _serviceTracing: IServiceTracingUc,
  ) { }

  private readonly logger = new Logging(PriceListUC.name);
  
  /**
   * Operación que envía la información para crear el dataload
   * @param {String} pathPriceList Endpoint donde se almacenara el dataload b2c
   * @param {String} pathPriceListB2b Endpoint donde se almacenara el dataload b2b
   */  
  async dataLoadConfiguration(pathPriceList: string, pathPriceListB2b: string){
    try {
      let jsonData = [];

      for (const category of Object.values(ECategoriesDataload)) {
        if (category == ECategoriesDataload.EQUIPMENT || category == ECategoriesDataload.TECHNOLOGY){
          this.logger.write(`GET PARENTS --> ${category}`, Etask.GET_PARENT_FROM_FEATURE, ELevelsErros.INFO, 'Price-List');
          const LIST_PARENTS = await this.dataloadProvider.getListParents(category);
          let dataJson = await this.generateRows(LIST_PARENTS, category);
          jsonData = jsonData.concat(dataJson);
        }
      }

      const HEADERS = [
        { id: 'PriceListUniqueId', title: 'PriceListUniqueId' },
        { id: 'PriceListName', title: 'PriceListName' },
        { id: 'CatentryUniqueId', title: 'CatentryUniqueId' },
        { id: 'CatentryPartNumber', title: 'CatentryPartNumber' },
        { id: 'Identifier', title: 'Identifier' },
        { id: 'Precedence', title: 'Precedence' },
        { id: 'StartDate', title: 'StartDate' },
        { id: 'EndDate', title: 'EndDate' },
        { id: 'LastUpdate', title: 'LastUpdate' },
        { id: 'QuantityUnitIdentifier', title: 'QuantityUnitIdentifier' },
        { id: 'MinimumQuantity', title: 'MinimumQuantity' },
        { id: 'Description', title: 'Description' },
        { id: 'PriceInCOP', title: 'PriceInCOP' },
        { id: 'PriceInCOPTax', title: 'PriceInCOPTax' },
        { id: 'PlazosSinImpuestos', title: 'PlazosSinImpuestos' },
        { id: 'PlazosConImpuestos', title: 'PlazosConImpuestos' },
        { id: 'Field1', title: 'Field1' },
        { id: 'Field2', title: 'Field2' },
        { id: 'Delete', title: 'Delete' }
      ]

      const CSV_ROOT_FILE = find.getCsv(generalConfig.pricesCatalog);
      await CreateCsv.createCsv(jsonData, CSV_ROOT_FILE, HEADERS, 'Offer', 'price_catalog_0');
      await CreateCsv.unificateFiles('price_catalog_0', CSV_ROOT_FILE);

      this.logger.write('UPLOAD FILE B2C', Etask.UPLOAD_FILE);
      await this.sftpProvider.update(CSV_ROOT_FILE, pathPriceList);
    } catch (error) {
      this.logger.write(`dataLoadConfiguration() | ${ETaskDesc.ERROR_GENERATE_DATALOAD}`, Etask.CREATE_PRICE_LIST);     
    }
  }

  /**
   * Operación para crear las filas del csv
   * @param {ICatalog[]} parents Arreglo con agrupación de padres e hijos	
   * @param {String} category Categoría solicitada
   * @returns {IPriceList[]} Arreglo con las filas para el archivo csv
   */    
  private async generateRows(parents: IParents[], category: string): Promise<IPriceList[]> {
    try {
      const ROWS: IPriceList[] = [];
      const PARENTS_LENGTH = parents.length;
      let count = 0;

      this.logger.write('START MAP PRICES', Etask.START_MAP_PRICES);

      const priceQueries = new Map<string, Promise<IPriceList[]>>();

      for (const { parentPartNumber } of parents) {
        let firstKey = Object.keys(parentPartNumber)[0];
        priceQueries.set(firstKey + "P", this.dataloadProviderPrices.getPrices(category, firstKey));

        for (const child of parentPartNumber[firstKey]) {
          priceQueries.set(child, this.dataloadProviderPrices.getPrices(category, child));
        }
      }

      for (const { parentPartNumber } of parents) {
        let firstKey = Object.keys(parentPartNumber)[0];
        let prices = await priceQueries.get(firstKey + "P");

        if (!prices || prices.length == 0) {
          prices = await this.dataloadProviderPrices.getPrices(category, parentPartNumber[firstKey][0]);
        }

        const pricesParent = prices.map(price => {
          price.CatentryPartNumber = firstKey + "P";
          return price;
        });

        ROWS.push(...pricesParent);

        for (const child of parentPartNumber[firstKey]) {
          const dataChild = await priceQueries.get(child);
          ROWS.push(...dataChild);
        }

        count++;

        if (count % 200 == 0) {
          this.logger.write(`${count} Agrupaciones procesadas de: ${PARENTS_LENGTH}`, Etask.CREATE_PRICE_LIST);
        }
      }

      this.logger.write('END MAP PRICES', Etask.END_MAP_PRICES);
      return ROWS;
    } catch (error) {
      this.logger.write(`generateRows() | ${ETaskDesc.ERROR_GENERATE_ROWS}`, Etask.CREATE_PRICE_LIST);
    }
  }
}