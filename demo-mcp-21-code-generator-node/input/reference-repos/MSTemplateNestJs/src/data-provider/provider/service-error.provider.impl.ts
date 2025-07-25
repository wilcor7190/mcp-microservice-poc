/**
 * Clase con la definición de operaciones a realizar en la coleccion coll_service_error
 * @author Fredy Santiago Martinez
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IServiceError } from 'src/core/entity/service-error/service-error.entity';
import { ServiceErrorModel } from '../model/service-error/service-error.model';
import { IServiceErrorProvider } from '../service-error.provider';

@Injectable()
export class ServiceErrorProvider implements IServiceErrorProvider {

    constructor(
        @InjectModel(ServiceErrorModel.name) private readonly serviceErrorModel: Model<ServiceErrorModel>,
    ) { }

    /**
    * Operación para consultar cantidad de errores según filtro
    * @param {*} filter arreglo de campos a consultar
    * @returns {Number} numero total errores asociados
    */ 
    async getTotal(filter: any): Promise<number> {
        return this.serviceErrorModel.countDocuments(filter);
    }

    /**
    * Operación para consultar errores según filtro
    * @param {*} filter arreglo de campos a consultar
    * @param {*} projection 
    * @returns {Object} informacion asociada   
    */
    async getServiceErrors( filter: any, projection: any = {}): Promise<IServiceError[]> {
        return this.serviceErrorModel.find(filter, projection)
    }

    /**
    * Operación para consultar errores por identificador
    * @param {String} id identificador de error
    * @returns {Object} Información asociada al error 
    */
    async getServiceError(id: string): Promise<IServiceError> {
        return this.serviceErrorModel.findOne({ id });
    }

    /**
    * Operación de inserción de un error
    * @param {IServiceError} serviceError arreglo con información del error
    */
    async createServiceError(serviceError: IServiceError) {
        await this.serviceErrorModel.insertMany(serviceError);
    }

}