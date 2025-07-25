/**
 * Obtiene la configuracion para el manejo de errores
 * @author alexisterzer
 */
import { Injectable } from '@nestjs/common';
import { ITaskError  } from '@claro/generic-models-library';

@Injectable()
export abstract class IServiceErrorUc {

    /**
    * Lógica creación errores en los ms
    * @param {Object} error arreglo información de error
    * @param {ITaskError} task Identificador de la tarea donde se genero el error
    */
    abstract createServiceError(error: any, task: ITaskError): Promise<void>;
}