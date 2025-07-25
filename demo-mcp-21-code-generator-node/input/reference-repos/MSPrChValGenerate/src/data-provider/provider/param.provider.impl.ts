/**
 * Clase con la definición de operaciones a realizar en la coleccion coll_params 
 * @author alexisterzer
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IParam ,ParamModel,ITaskError } from '@claro/generic-models-library';
import { IParamProvider } from '../param.provider';
import * as moment from 'moment';
import Logging from 'src/common/lib/logging';
import Traceability from 'src/common/lib/traceability';
import { EDescriptionTracingGeneral,ETaskTracingGeneral, EStatusTracingGeneral, MappingApiRest } from 'src/common/utils/enums/tracing.enum';
import { IServiceTracingUc } from 'src/core/use-case/resource/service-tracing.resource.uc';
import { ELevelsErros } from 'src/common/utils/enums/logging.enum';
import utils from 'src/common/utils/GeneralUtil';
import { Etask, ETaskDesc } from 'src/common/utils/enums/taks.enum';
import { IServiceErrorUc } from 'src/core/use-case/resource/service-error.resource.uc';
import databaseConfig from 'src/common/configuration/database.config';
import * as APM from '@claro/general-utils-library';

@Injectable()
export class ParamProvider implements IParamProvider {

    private readonly logger = new Logging(ParamProvider.name);


    constructor(
        @InjectModel(ParamModel.name,databaseConfig.database) private readonly paramModel: Model<ParamModel>,
        private readonly _serviceTracing: IServiceTracingUc,
        public readonly _serviceError: IServiceErrorUc,

    ) { }

    /**
    * Operación para consultar cantidad de registros
    * @param {*} filter arreglo de campos a consultar
    */
    async getTotal(filter: any): Promise<number> {
        return this.paramModel.countDocuments(filter);
    }

    /**
    * Operación para consultar parametros según filtro
    * @param {Number} page Número de página a consultar
    * @param {Number} limit Cantidad de registros por página
    * @param {Object} filter arreglo de campos a consultar
    */
    async getParams(page: number, limit: number, filter: any, projection: any = {}): Promise<IParam[]> {
        return this.paramModel.find(filter, projection)
            .skip(limit * (page - 1))
            .limit(limit);
    }

    /**
    * Operación para consultar parametros por identificador
    * @param {String} id_param identificador de parametro
    */
    async getParamByIdParam(id_param: string): Promise<IParam> {
        let spanIn: any;
        try {
            const startTime = process.hrtime();
            let traceability = new Traceability({});  
            traceability.setTransactionId(utils.getCorrelationalId);
            traceability.setTask(`REQUEST_CONSUMO_BD_${ETaskTracingGeneral.GET_PARAMS}`);
            traceability.setStatus(EStatusTracingGeneral.BD_SUCCESS);
            traceability.setRequest(id_param);
            this._serviceTracing.createServiceTracing(traceability.getTraceability());

            spanIn = APM.startSpan(ParamModel.name, MappingApiRest.DB,'getParamByIdParam',Etask.APM);

            const result = await this.findParams(id_param);

            const processingTime = this.processExecutionTime(startTime);

            let traceabilityResponse = new Traceability({});
            traceabilityResponse.setTransactionId(utils.getCorrelationalId);
            traceabilityResponse.setTask(`RESPONSE_CONSUMO_BD_${ETaskTracingGeneral.GET_PARAMS}`);
            traceabilityResponse.setStatus((result == undefined || result == null) ? EStatusTracingGeneral.BD_WARN : EStatusTracingGeneral.BD_SUCCESS);
            traceabilityResponse.setRequest(id_param);
            traceabilityResponse.setProcessingTime(processingTime);
            this._serviceTracing.createServiceTracing(traceabilityResponse.getTraceability());
            this.logger.write('Resultado ejecución BD', ETaskTracingGeneral.GET_PARAMS, ELevelsErros.INFO, id_param, result, processingTime);

            return result
        } catch (error) {
            let traceability = new Traceability({});
            traceability.setTransactionId(utils.getCorrelationalId);
            traceability.setStatus(EStatusTracingGeneral.ERROR);
            traceability.setDescription(EDescriptionTracingGeneral.START_FEATURES_TRANSFORM_PROCESS);
            traceability.setTask(ETaskTracingGeneral.FILE_TRANSFORM);
            await this._serviceTracing.createServiceTracing(traceability.getTraceability());
            this.logger.write('getParamByIdParam() ' + error.tasks, Etask.ERROR_DATA, ELevelsErros.ERROR);
            utils.assignTaskError(error, Etask.GET_PARAMS, ETaskDesc.GET_PARAMS);
            await this.getError(error);

        }finally{
            if(spanIn) spanIn.end();
        }

    }
    
    /**
    * Operación para consultar parametros por identificador
    * @param {String} id_param identificador de parametro
    */
    async findParams(id_param: string): Promise<IParam> {
        return this.paramModel.findOne({ id_param }).lean();
    }

    /**
    * Operación de actualización de un parametro
    * @param {IParam} param arreglo con información del parametro
    */
    async updateParam(param: IParam): Promise<IParam> {

        return this.paramModel.findOneAndUpdate(
            {
                id_param: param.id_param,
            },
            {
                $set: {
                    id_param: param.id_param,
                    description: param.description,
                    status: param.status,
                    updatedUser: 'admin', // Pendiente de captura del usuario por sistema.
                    updatedAt: moment().format(),
                    values: param.values,

                }
            },
            {
                new: true
            }
        );

    }

    async setLoadTime(id_param: string): Promise<any> {
        return this.paramModel.updateMany(
            {
                id_param: id_param
            },
            {
                $set: {
                    "values.$[].loadTime": "0"
                }
            })
    }

      /**
     * Operación para consultar las caracteristicas habilitadas
     * @param {String} family Filtro para obtener las caracteristicas
     * @returns {Object} Caracteristicas habilitadas
     */
      async getFeaturesEnabled(family: string): Promise<any> {
        let spanIn: any;
        try {
            const START_TIME = process.hrtime();
            spanIn = APM.startSpan(ParamModel.name, MappingApiRest.DB,'getFeaturesEnabled',Etask.APM);
            const DATA_PARAMS =  this.paramModel.findOne(
                {
                    id_param: "Caracteristicas",
                    "values.Family": family
                },
                {
                    "values.$": 1
                }
            ).lean();
            const processingTime = this.processExecutionTime(START_TIME);
            this.logger.write(`Consultando caracteristcas params => ${family}`, Etask.FIND_AVAILABLE_FEATURES, ELevelsErros.INFO, family, '', processingTime);

            return DATA_PARAMS;
        } catch (error) {
            let traceability = new Traceability({});
            traceability.setTransactionId(utils.getCorrelationalId);
            traceability.setStatus(EStatusTracingGeneral.ERROR);
            traceability.setDescription(EDescriptionTracingGeneral.FIND_AVAILABLE_FEATURES);
            traceability.setTask(ETaskTracingGeneral.GET_PARAMS);
            await this._serviceTracing.createServiceTracing(traceability.getTraceability());
            this.logger.write('getParamByIdParam() ' + error.tasks, Etask.ERROR_DATA, ELevelsErros.ERROR);
            utils.assignTaskError(error, Etask.GET_PARAMS, ETaskDesc.GET_PARAMS);
            await this.getError(error);
        }finally {
            if (spanIn) spanIn.end();
        }

    }

    /**
   * Funcion para registrar los errores
   * @param {any} error error capturado
   * @param {any}request
   */
  async getError(error:any) {
    let task: ITaskError = {
        taskName: error?.task_name || '',
        taskDescription: error?.task_description || '',
        description: error._description
    }
    this._serviceError.createServiceError(error, task);  
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
