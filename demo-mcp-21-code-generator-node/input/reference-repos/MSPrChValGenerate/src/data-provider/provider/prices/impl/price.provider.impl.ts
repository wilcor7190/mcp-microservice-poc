/**
 * clase abstracta donde se realiza busqueda de duplicados de producto
 * * @author Juan Gabriel Garzon
 */
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IPricesListDTO } from "src/controller/dto/general/prices/price.dto";
import { GeneralModel } from '../../../model/general/general.model';
import { IPriceProvider } from "../price.provider";
import { CollectionsNames } from "src/common/utils/enums/collectionsNames.enum";
import DbConnection from "src/common/utils/dbConnection";
import Logging from "src/common/lib/logging";
import { Etask, ETaskDesc } from "src/common/utils/enums/taks.enum";
import { ELevelsErros } from "src/common/utils/enums/logging.enum";
import utils from 'src/common/utils/GeneralUtil';
import { EDescriptionTracingGeneral, EStatusTracingGeneral, ETaskTracingGeneral, MappingApiRest } from 'src/common/utils/enums/tracing.enum';
import Traceability from 'src/common/lib/traceability';
import { IServiceTracingUc } from 'src/core/use-case/resource/service-tracing.resource.uc';
import { IGetErrorTracingUc } from 'src/core/use-case/resource/get-error-tracing.resource.uc';
import { FamilyParams } from "src/common/utils/enums/params.enum";
import databaseConfig from "src/common/configuration/database.config";
import * as APM from '@claro/general-utils-library';

export class PriceProvider implements IPriceProvider {
  private readonly logger = new Logging(PriceProvider.name);

  constructor(
    @InjectModel(GeneralModel.name, databaseConfig.database) private readonly generalModel: Model<GeneralModel>,
    public readonly _GetErrorTracing: IGetErrorTracingUc,
    public readonly _serviceTracing: IServiceTracingUc,
  ) { }

  async saveTransformData(content: IPricesListDTO): Promise<any> {
    let spanIn: any;
    try {
      spanIn = APM.startSpan(GeneralModel.name, MappingApiRest.DB, 'saveTransformData', Etask.APM);
      return this.generalModel.insertMany(content);
    } finally {
      if (spanIn) spanIn.end();
    }
  }

  async deleteDataColPrtProductOffering(family: any): Promise<any> {
    let spanIn: any;
    try {
      spanIn = APM.startSpan(GeneralModel.name, MappingApiRest.DB, 'deleteDataColPrtProductOffering', Etask.APM);
      return this.generalModel.deleteMany({ "data.getProductOfferingResponse.versions.family": family })

    } finally {
      if (spanIn) spanIn.end();
    }
  }

  async deletePricesCollections(family: string): Promise<void> {
    const { client, db } = await DbConnection.dbConnection();
    let spanIn: any;
    try {
      const START_TIME = process.hrtime();
      spanIn = APM.startSpan(GeneralModel.name, MappingApiRest.DB, 'deletePricesCollections', Etask.APM);
      switch (family) {
        case FamilyParams.TerLibres:
          const collectionLibres = db.collection(CollectionsNames.TERMINALES_LIBRES);
          await collectionLibres.deleteMany({});
          break;
        case FamilyParams.kitprepago:
          const collectionKitPrepago = db.collection(CollectionsNames.TERMINALES_KIT_PREPAGO);
          await collectionKitPrepago.deleteMany({});
          break;
        case FamilyParams.technology:
          const collectionTec = db.collection(CollectionsNames.TECNOLOGIA);
          await collectionTec.deleteMany({});
          break;
      }
      const processingTime = this.processExecutionTime(START_TIME);
      this.logger.write('Borrando coleccion Prices', Etask.DELETE_PRICESCOLLECTIONS, ELevelsErros.INFO, '', '', processingTime);

    } catch (error) {
      await this._GetErrorTracing.createTraceability(EStatusTracingGeneral.ERROR,
        EDescriptionTracingGeneral.DATA_PRICES, ETaskTracingGeneral.DELETE_DATA);
      this.logger.write('deletePricesCollections()' + error.stack, Etask.DELETE_PRICESCOLLECTIONS, ELevelsErros.ERROR);
      utils.assignTaskError(error, Etask.DELETE_PRICESCOLLECTIONS, ETaskDesc.DELETE_DATA);
      await this._GetErrorTracing.getError(error);

    } finally {
      client.close();
      if (spanIn) spanIn.end();
    }

  }

  async getJoinPricesFeatures(collection: string, filter: string): Promise<any> {
    const { client, db } = await DbConnection.dbConnection();
    let consultaIva, ventaSinDescuento, precioBase,ivaSinDescuento

    if (filter == 'PO_Tec') {
      consultaIva = {
        $subtract: [{ '$toDouble': '$Prec._Equipo_con_IVA(ZP09)' }, { '$toDouble': '$Pr._Equipo_sin_IVA(ZC01)' }] 
      }

    } else {
      consultaIva = {
        $subtract: [{ '$toDouble': '$Precio_IVA_Final-Red(ZP05)' }, { '$toDouble': '$Precio_sin_IVA(ZP06)' }] 
      }

    }
    const coleccion = db.collection(collection);
    let spanIn: any;
    try {

      const START_TIME = process.hrtime();
      let traceability = new Traceability({});
      traceability.setTransactionId(utils.getCorrelationalId);
      traceability.setTask(`REQUEST_CONSUMO_BD_${Etask.FIND_JOINPRICESFEATURES}`);
      traceability.setStatus(EStatusTracingGeneral.BD_SUCCESS);
      traceability.setRequest({ collection, filter });
      this._serviceTracing.createServiceTracing(traceability.getTraceability());
      spanIn = APM.startSpan(GeneralModel.name, MappingApiRest.DB, 'getJoinPricesFeatures', Etask.APM);

      const DATA = await coleccion.aggregate([
        {
          '$addFields': {
            'filter': {     //aggrega estas filas a la consulta  filter y concatena el filter PO_Equ con el equipo    
              '$concat': [
                filter, '$Equipo'
              ]
            },
            'VENTA_SIN_DESCUENTO': {
              $sum: [{ '$toDouble': "$Base_Comercial(ZTBC)" }, { '$toDouble': "$Menos_Simcard(ZD23)" }] 
            },
            'IMPUESTO_IVA': consultaIva,
            'IVA_SIN_DESCUENTO': {
             $sum: [{ '$toDouble': "$IVA_repercutido(MWST)" }, { '$toDouble': "$IVA_SIM" }] 
            },
          },

        } // aqui seria projection 
        , {
          '$lookup': {
            'from': 'COLPRTTTATTRIBUTES',
            'localField': 'filter',
            'foreignField': 'id',
            'as': 'features'
          }
        }, {
          '$match': {
            //      'Equipo': {'$eq':'70048927'},70010932
            'features': {
              '$ne': []
            }
          }
        },
        {
          $unwind: "$filter"
        },
        {
          $group: {
            _id: "$filter",
            doc: {
              $first: "$$ROOT"
            }
          }
        },
        {
          $replaceRoot: {
            newRoot: "$doc"
          }
        },

        {
          $project: {
            '_id': 0,
            'MenosSimCard': '$Menos_Simcard(ZD23)',
            'PrecioSinIVASinSim': '$Prec_sin_IVA_sin_SIM(ZP07)',
            'Precio_sin_IVA': '$Precio_sin_IVA(ZP06)',
            'Precio_IVA_Final': '$Precio_IVA_Final-Red(ZP05)',
            'IVA_SIM': '$IVA_SIM',
            'Precio_sin_descuento': {
              $convert: {
                input: "$VENTA_SIN_DESCUENTO",
                to: "int",
                onError: "An error occurred",
                onNull: "Input was null or empty"
              }
            },
            'Precio_Base_descuento': {
              $convert: {
                input: "$PRECIO_BASE",
                to: "int",
                onError: "An error occurred",
                onNull: "Input was null or empty"
              }
            },
            'Precio_impuestoIva': {
              $convert: {
                input: "$IMPUESTO_IVA",
                to: "int",
                onError: "An error occurred",
                onNull: "Input was null or empty"
              }
            },
            'Iva_sinDescuento': {
              $convert: {
                input: "$IVA_SIN_DESCUENTO",
                to: "int",
                onError: "An error occurred",
                onNull: "Input was null or empty"
              }
            },
            Equipo: '$Equipo',
            filter: '$filter',
            Und_Disponibles: '$Und_Disponibles',
            features: '$features',
            family: '$family'

          }
        }
      ]).toArray();

      const processingTime = this.processExecutionTime(START_TIME);

      let traceabilityResponse = new Traceability({});
      traceabilityResponse.setTransactionId(utils.getCorrelationalId);
      traceabilityResponse.setTask(`RESPONSE_CONSUMO_BD_${Etask.FIND_JOINPRICESFEATURES}`);
      traceabilityResponse.setStatus((DATA.lengt === 0) ? EStatusTracingGeneral.BD_WARN : EStatusTracingGeneral.BD_SUCCESS);
      traceabilityResponse.setRequest({ collection, filter });
      traceabilityResponse.setProcessingTime(processingTime);
      this._serviceTracing.createServiceTracing(traceabilityResponse.getTraceability());
      this.logger.write('Resultado ejecución BD', Etask.FIND_JOINPRICESFEATURES, ELevelsErros.INFO, { collection, filter }, '', processingTime);
      return DATA;
    } catch (error) {
      await this._GetErrorTracing.createTraceability(EStatusTracingGeneral.ERROR,
        EDescriptionTracingGeneral.START_DATA_CONSULTATION_PROCESS, ETaskTracingGeneral.FIND_PRICES);
      this.logger.write('PriceJoinAttributes ' + error.tasks, Etask.ERROR_TRANSFORM_PRICES_EQU_TECH, ELevelsErros.ERROR);
      utils.assignTaskError(error, Etask.ERROR_TRANSFORM_PRICES_EQU_TECH, ETaskDesc.ERROR_TRANSFORM_PRICES_EQU_TECH);
      await this._GetErrorTracing.getError(error);

    } finally {
      await client.close();
      if (spanIn) spanIn.end();
    }


  }

  getDescuentos(){
    let consultaIva, ventaSinDescuento, precioBase,ivaSinDescuento
    let filter = 'PO_Tec'
    if (filter == 'PO_Tec') {
      consultaIva = {
        $subtract: [{ '$toDouble': '$Prec._Equipo_con_IVA(ZP09)' }, { '$toDouble': '$Pr._Equipo_sin_IVA(ZC01)' }]
      }
      ventaSinDescuento = {
        $sum: [{ '$toDouble': "$Base_Comercial(ZTBC)" }, { '$toDouble': "$IVA_repercutido(MWST)" }]
      }
      precioBase = { '$toDouble': "$Base_Comercial(ZTBC)" }
      ivaSinDescuento={'$toDouble': "$IVA_repercutido(MWST)"}
    } else {

      consultaIva = {
        $subtract: [{ '$toDouble': '$Precio_IVA_Final-Red(ZP05)' }, { '$toDouble': '$Precio_sin_IVA(ZP06)' }]
      }
      ventaSinDescuento = {
        $sum: [{ '$toDouble': "$Base_Comercial(ZTBC)" }, { '$toDouble': "$Menos_Simcard(ZD23)" }, { '$toDouble': "$IVA_repercutido(MWST)" }, { '$toDouble': "$IVA_SIM" }]
      }
      precioBase = {
        $sum: [{ '$toDouble': "$Base_Comercial(ZTBC)" }, { '$toDouble': "$Menos_Simcard(ZD23)" }]
      }
      ivaSinDescuento={
        $sum: [{ '$toDouble': "$IVA_repercutido(MWST)" }, { '$toDouble': "$IVA_SIM" }]
      }

    }

    return [{
      '$addFields': {
        'filter': {     //aggrega estas filas a la consulta  filter y concatena el filter PO_Equ con el equipo    
          '$concat': [
            filter, '$Equipo'
          ]
        },
        'VENTA_SIN_DESCUENTO': ventaSinDescuento,
        'PRECIO_BASE': precioBase,
        'IMPUESTO_IVA': consultaIva,
        'IVA_SIN_DESCUENTO': ivaSinDescuento,
      },

    }]
  }


  /**
    * Función para generar log informativo para el services provider de Message
    * @param {any} startTime cadena fecha inicio consulta bd
    */
  processExecutionTime(startTime: any): number {
    const endTime = process.hrtime(startTime);
    return Math.round((endTime[0] * 1000) + (endTime[1] / 1000000));
  }
}
