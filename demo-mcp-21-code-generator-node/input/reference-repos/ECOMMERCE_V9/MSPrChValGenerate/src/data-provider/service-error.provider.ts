/**
 * Clase abstracta con la definición de operaciones a realizar en la coleccion coll_service_error
 * @author alexisterzer
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

}