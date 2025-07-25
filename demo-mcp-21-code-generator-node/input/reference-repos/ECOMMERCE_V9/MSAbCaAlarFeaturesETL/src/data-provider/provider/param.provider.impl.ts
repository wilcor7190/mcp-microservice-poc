/**
 * Clase con la definición de operaciones a realizar en la coleccion coll_params 
 * @author Oscar Avila
 */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IParam, ParamModel } from '@claro/generic-models-library';
import { Model } from 'mongoose';
import { IParamProvider } from '../param.provider';
import * as moment from 'moment';
import Logging from '../../common/lib/logging';
import { Etask } from '../../common/utils/enums/taks.enum';
import databaseConfig from '../../common/configuration/database.config';

@Injectable()
export class ParamProvider implements IParamProvider {

    constructor(
        @InjectModel(ParamModel.name, databaseConfig.dbFeatures) private readonly paramModel: Model<ParamModel>,
    ) { }

    private readonly logger = new Logging(ParamProvider.name);

    /**
    * Operación para consultar cantidad de registros
    * @param {Object} filter arreglo de campos a consultar
    * @returns {Number} total registros 
    */
    async getTotal(filter: any): Promise<number> {
        return this.paramModel.countDocuments(filter);
    }

    /**
    * Operación para consultar parametros según filtro
    * @param {Number} page Número de página a consultar
    * @param {Number} limit Cantidad de registros por página
    * @param {Object} filter arreglo de campos a consultar
    * @param {Object} projection arreglo de campos a devolver
    * @returns {Object} Información parametros
    */
    async getParams(page: number, limit: number, filter: any, projection: any = {}): Promise<IParam[]> {
        return this.paramModel.find(filter, projection)
            .skip(limit * (page - 1))
            .limit(limit);
    }

    /**
    * Operación para consultar parametros por identificador
    * @param {String} id_param identificador de parametro
    * @returns {Object} Información parametros
    */
    async getParamByIdParam(id_param: string): Promise<IParam> {
        return this.paramModel.findOne({ id_param }).lean();
    }

    /**
    * Operación de actualización de un parametro
    * @param {IParam} param arreglo con información del parametro
    * @returns {Object} parametro actualizado
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

    /**
     * Operación para consultar las caracteristicas habilitadas
     * @param {String} family Filtro para obtener las caracteristicas
     * @returns {Object} Caracteristicas habilitadas
     */
    async getFeaturesEnabled(family: string): Promise<any>{
        const START_TIME = process.hrtime();
        const DATA_PARAMS = this.paramModel.findOne(
            {
                id_param: "Caracteristicas",
                "values.Family": family
            },
            {
                "values.$": 1
            }
        ).lean();
        this.createLog({family}, START_TIME, Etask.FIND_AVAILABLE_FEATURES);
        return DATA_PARAMS;
    }   
    
    /**
     * Operación para crear log
     * @param {Object} request 
     * @param startTime 
     * @param {Etask} task Tarea realizada
     */
    async createLog(request: any, startTime: any, task: Etask){
        // Calcular el tiempo transcurrido
        const endTime = process.hrtime(startTime);
        const executionTime = Math.round((endTime[0] * 1000) + (endTime[1] / 1000000));
        this.logger.write(`Consultando información - tiempo de ejecución createLog()`, task, false, request, '', executionTime);
    }     
}