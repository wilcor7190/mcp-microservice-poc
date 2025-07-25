/**
 * Clase abstracta con la definición de operaciones a realizar en la coleccion tracing
 * @author Uriel esguerra
 */

import { Injectable } from '@nestjs/common';
import { IServiceTracing } from '@claro/generic-models-library';
@Injectable()
export abstract class IServiceTracingProvider {

    abstract createServiceTracing(serviceTracing: IServiceTracing);

}