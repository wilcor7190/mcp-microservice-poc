import { Injectable } from '@nestjs/common';
import { IServiceTracing } from '@claro/generic-models-library';

/**
 * Clase abstracta para el manejo de trazabilidad en el ms
 * @author Santiago Vargas
 */
@Injectable()
export abstract class IServiceTracingUc {

    /**
    * Lógica de trazabilidad en los ms
    * @param {IServiceTracing} serviceTracing arreglo información de trazabilidad
    */    
    abstract createServiceTracing(serviceTracing: IServiceTracing);

}