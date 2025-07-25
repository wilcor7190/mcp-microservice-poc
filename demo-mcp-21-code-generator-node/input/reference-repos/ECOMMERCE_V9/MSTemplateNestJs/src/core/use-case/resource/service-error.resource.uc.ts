/**
 * Clase abstracta para el manejo de errores en el ms
 * @author Fredy Santiago Martinez
 */
import { Injectable } from '@nestjs/common';
import { ITaskError } from 'src/core/entity/service-error/task-error.entity';
import { IServiceTracingInicial } from 'src/core/entity/service-tracing/service-tracing.entity';

@Injectable()
export abstract class IServiceErrorUc {

    /**
    * Lógica creación errores en los ms
    * @param {Object} error arreglo información de error
    * @param {ITaskError} task Identificador de la tarea donde se genero el error
    * @param {IServiceTracingInicial} tracingInfoPrincipal arreglo información adicional donde se genero el error
    */
    abstract createServiceError(error: any, task: ITaskError, tracingInfoPrincipal?:IServiceTracingInicial);
   
   /**
    * Consulta información de errores
    * @param {Object} filter Objeto de campos a consultar
    */
    abstract getServiceErrors( filter: any)
}