/**
 * crea la configuracion del tracing
 * @author alexisterzer
 */
import { Injectable } from '@nestjs/common';
import { IServiceTracing } from '@claro/generic-models-library';


@Injectable()
export abstract class IServiceTracingUc {

    abstract createServiceTracing(serviceTracing: IServiceTracing);

}