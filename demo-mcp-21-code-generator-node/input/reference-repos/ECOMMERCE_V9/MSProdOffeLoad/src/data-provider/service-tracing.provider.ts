/**
 * Clase donde se definen metodos de la trazabilidad
 * @author Yhon Estevez
 */
import { Injectable } from '@nestjs/common';
import { IServiceTracing } from '@claro/generic-models-library';
@Injectable()
export abstract class IServiceTracingProvider {

    abstract createServiceTracing(serviceTracing: IServiceTracing);

}