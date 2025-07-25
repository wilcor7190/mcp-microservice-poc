import { Injectable } from '@nestjs/common';
import { IServiceTracing } from '@claro/generic-models-library';

/**
 * Clase abstracta con la definición de operaciones a realizar en la coleccion coll_traceability
 * @author Santiago Vargas
 */
@Injectable()
export abstract class IServiceTracingProvider {
    /**
    * Operación de inserción de una trazabilidad
    * @param {IServiceTracing} serviceTracing arreglo con información de la traza
    */
    abstract createServiceTracing(serviceTracing: IServiceTracing);
}