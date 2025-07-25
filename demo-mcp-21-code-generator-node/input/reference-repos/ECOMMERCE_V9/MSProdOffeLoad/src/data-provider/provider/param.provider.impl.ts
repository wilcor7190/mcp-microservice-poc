/**
 * Clase con la definición de operaciones a realizar en la coleccion coll_params 
 * @author Oscar Avila
 */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IParamProvider } from '../param.provider';
import * as moment from 'moment';
import databaseConfig from '../../common/configuration/database.config';
import { ParamModel, IParam } from '@claro/generic-models-library';

@Injectable()
export class ParamProvider implements IParamProvider {

    constructor(
        @InjectModel(ParamModel.name, databaseConfig.database) private readonly paramModel: Model<ParamModel>,
    ) { }

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
        return this.paramModel.findOne({ id_param });
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
}