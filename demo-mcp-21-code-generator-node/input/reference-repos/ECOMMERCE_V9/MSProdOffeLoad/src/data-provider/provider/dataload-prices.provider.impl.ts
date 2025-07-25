/**
 * Clase con la definición de operaciones a realizar en las colecciones de catalogo (Precios)
 * @author Santiago Vargas
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Logging from '../../common/lib/logging';
import Traceability from '../../common/lib/traceability';
import GeneralUtil from '../../common/utils/generalUtil';
import { ECategoriesDataload } from '../../common/utils/enums/categories-dataload.enum';
import { ETaskDesc, Etask } from '../../common/utils/enums/taks.enum';
import { EDescriptionTracingGeneral, EStatusTracingGeneral, ETaskTracingGeneral } from '../../common/utils/enums/tracing.enum';
import { IDisponibility } from '../../core/entity/catalog/disponibility.entity';
import { IPriceList } from '../../core/entity/catalog/price-list.entity';
import { IServiceTracingUc } from '../../core/use-case/resource/service-tracing.resource.uc';
import { IDataloadProviderPrices } from '../dataload-prices.provider';
import { DisponibilityModel } from '../model/dataload/disponibility.model';
import { PriceListEquModel } from '../model/dataload/price-equ.model';
import { PriceListHomeModel } from '../model/dataload/price-home.model';
import { PriceListPosModel } from '../model/dataload/price-pos.model';
import { PriceListPreModel } from '../model/dataload/price-pre.model';
import { PriceListTecModel } from '../model/dataload/price-tec.model';
import * as APM from '@claro/general-utils-library';
import { MappingApiRest } from '../../common/utils/enums/mapping-api-rest';
import databaseConfig from '../../common/configuration/database.config';
import { ELevelsErros } from '../../common/utils/enums/logging.enum';

@Injectable()
export class DataloadProviderPricesImpl implements IDataloadProviderPrices {

  constructor(
    @InjectModel(PriceListEquModel.name, databaseConfig.databasePrices) private readonly priceEquModel: Model<PriceListEquModel>,
    @InjectModel(PriceListTecModel.name, databaseConfig.databasePrices) private readonly priceTecModel: Model<PriceListTecModel>,
    @InjectModel(PriceListPreModel.name, databaseConfig.databasePrices) private readonly pricePreModel: Model<PriceListPreModel>,
    @InjectModel(PriceListPosModel.name, databaseConfig.databasePrices) private readonly pricePosModel: Model<PriceListPosModel>,
    @InjectModel(PriceListHomeModel.name, databaseConfig.databasePrices) private readonly priceHomeModel: Model<PriceListHomeModel>,
    @InjectModel(DisponibilityModel.name, databaseConfig.databaseDisponibility) private readonly disponibilityModel: Model<DisponibilityModel>,
    public readonly _serviceTracing: IServiceTracingUc,
  ) { }

  private readonly logger = new Logging(DataloadProviderPricesImpl.name);

  /**
   * Operación para consultar lista de precios por partNumber
   * @param {String} category Categoría solicitada
   * @param {String} partNumber PartNumber a consultar
   * @returns {IPriceList[]} Lista de precios por partnumber
   */
  async getPrices(category: string, partNumber: string): Promise<IPriceList[]> {
    let spanIn: any;
    try {
      switch (category) {
        case ECategoriesDataload.EQUIPMENT:
          spanIn = APM.startSpan(PriceListEquModel.name, MappingApiRest.DB,'getPrices',Etask.APM);
          return this.priceEquModel.find({ "CatentryPartNumber": partNumber });

        case ECategoriesDataload.TECHNOLOGY:
          spanIn = APM.startSpan(PriceListTecModel.name, MappingApiRest.DB,'getPrices',Etask.APM);
          return this.priceTecModel.find({ "CatentryPartNumber": partNumber });
        
        case ECategoriesDataload.POSPAGO:
          spanIn = APM.startSpan(PriceListPosModel.name, MappingApiRest.DB,'getPrices',Etask.APM);
          return this.pricePosModel.find({ "CatentryPartNumber": partNumber });

        case ECategoriesDataload.PREPAGO:
          spanIn = APM.startSpan(PriceListPreModel.name, MappingApiRest.DB,'getPrices',Etask.APM);
          return this.pricePreModel.find({ "CatentryPartNumber": partNumber })

        case ECategoriesDataload.HOMES:
          spanIn = APM.startSpan(PriceListHomeModel.name, MappingApiRest.DB,'getPrices',Etask.APM);
          return this.priceHomeModel.find({ "CatentryPartNumber": partNumber })
      }
    } catch (error) {
      this.logger.write(`getPrices() | ${ETaskDesc.ERROR_FIND_DATA} - ${category}`, Etask.FIND_PRICES);

      this.createTraceability(
        EStatusTracingGeneral.ERROR,
        EDescriptionTracingGeneral.SAVE_FILE, ETaskTracingGeneral.ERROR_FIND_DATA,);

    }finally{
      if(spanIn) spanIn.end();
    }
  }

  /**
   * Operación para consultar la disponibilidad de los productos
   * @returns {IDisponibility[]} Arreglo con la disponibilidad de los productos
   */  
  async findDisponibility(): Promise<IDisponibility[]> {
    let spanIn: any;
    try {
      const START_TIME = process.hrtime();
      spanIn = APM.startSpan(DisponibilityModel.name, MappingApiRest.DB,'findDisponibility',Etask.APM);
      const DATA_DISPONIBILITY = this.disponibilityModel.find();
      this.logger.write('', START_TIME, ELevelsErros.INFO, Etask.FIND_DISPONIBILITY);
      return DATA_DISPONIBILITY;
    } catch (error) {
      this.logger.write(`findDisponibility() | ${ETaskDesc.ERROR_FIND_DATA}`, Etask.FIND_DISPONIBILITY);

      this.createTraceability(
        EStatusTracingGeneral.ERROR,
        EDescriptionTracingGeneral.SAVE_FILE, ETaskTracingGeneral.ERROR_FIND_DATA,);
    }finally{
      if(spanIn) spanIn.end();
    }
  }

   /**
  * Funcion para registrar la trazabilidad
  * @param {EStatusTracingGeneral} status Estado de la trazabilidad
  * @param {EDescriptionTracingGeneral}description Descripcion de la tarea
  * @param {ETaskTracingGeneral}task Nombre de la tarea
  */
   private async createTraceability(
    status: EStatusTracingGeneral,
    description: EDescriptionTracingGeneral | string,
    task: ETaskTracingGeneral
): Promise<void> {
    let traceability = new Traceability({});
    traceability.setTransactionId(GeneralUtil.getCorrelationalId);
    traceability.setStatus(status);
    traceability.setDescription(description);
    traceability.setTask(task);
    await this._serviceTracing.createServiceTracing(traceability.getTraceability());
}
}
