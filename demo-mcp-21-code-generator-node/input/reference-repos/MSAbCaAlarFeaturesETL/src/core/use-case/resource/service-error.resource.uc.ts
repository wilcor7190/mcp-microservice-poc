import { Injectable } from '@nestjs/common';
import { ITaskError } from '../../entity/service-error/task-error.entity';

/**
 * Clase abstracta para el manejo de errores en el ms
 * @author Santiago Vargas
 */
@Injectable()
export abstract class IServiceErrorUc {

    /**
    * Lógica creación errores en los ms
    * @param {Object} error arreglo información de error
    * @param {ITaskError} task Identificador de la tarea donde se genero el error
    * @param {Object} request arreglo información adicional donde se genero el error
    */
    abstract createServiceError(error: any, task: ITaskError);

}