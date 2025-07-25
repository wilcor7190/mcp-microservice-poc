/**
 * Clase abstracta con la definición de operaciones a realizar en la coleccion coll_service_error
 * @author Oscar Avila
 */
import { Injectable } from '@nestjs/common';
import { IServiceError } from '@claro/generic-models-library';

@Injectable()
export abstract class IServiceErrorProvider {

    /**
    * Operación de inserción de un error
    * @param {IServiceError} ServiceErrors arreglo con información del error
    */
    abstract createServiceError(ServiceErrors: IServiceError);

    /**
    * Operación para consultar errores según filtro
    * @param {Object} filter arreglo de campos a consultar
    */
    abstract getServiceErrors( filter: any): Promise<IServiceError[]>;

    /**
    * Operación para consultar cantidad de errores 
    * @param {Object} filter arreglo de campos a consultar
    * @returns {Number} total errores  
    */    
    abstract getTotal(filter: any): Promise<number>

    /**
    * Operación para consultar errores por identificador
    * @param {String} id identificador de error
    * @returns {Object} Información errores
    */
    abstract getServiceError(id: string): Promise<IServiceError>;

}