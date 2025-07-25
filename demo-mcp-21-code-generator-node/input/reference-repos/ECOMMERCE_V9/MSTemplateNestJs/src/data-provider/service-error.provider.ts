/**
 * Clase abstracta con la definición de operaciones a realizar en la coleccion coll_service_error
 * @author Fredy Santiago Martinez
 */

import { Injectable } from '@nestjs/common';
import { IServiceError } from 'src/core/entity/service-error/service-error.entity';

@Injectable()
export abstract class IServiceErrorProvider {

    /**
    * Operación de inserción de un error
    * @param {IServiceError} ServiceErrors arreglo con información del error
    */
    abstract createServiceError(ServiceErrors: IServiceError);

    /**
    * Operación para consultar errores según filtro
    * @param {*} filter arreglo de campos a consultar
    */
    abstract getServiceErrors( filter: any): Promise<IServiceError[]>;

    /**
    * Operación para consultar cantidad de errores 
    * @param {*} filter arreglo de campos a consultar
    */  
    abstract getTotal(filter: any): Promise<number>

    /**
    * Operación para consultar errores por identificador
    * @param {String} id identificador de error
    */
    abstract getServiceError(id: string): Promise<IServiceError>;

}