/**
 * Clase donde se definen metodos para crear la trazabilidad
 * @author Yhon Estevez
 */
import { IServiceTracing } from '@claro/generic-models-library';
import { Injectable } from '@nestjs/common';
@Injectable()
export abstract class IServiceTracingUc {

    abstract createServiceTracing(serviceTracing: IServiceTracing);

}