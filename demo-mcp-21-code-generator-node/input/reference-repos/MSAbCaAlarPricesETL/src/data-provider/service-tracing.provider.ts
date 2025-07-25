import { IServiceTracing } from '@claro/generic-models-library/src/core/entity';
import { Injectable } from '@nestjs/common';
@Injectable()
export abstract class IServiceTracingProvider {

    abstract createServiceTracing(serviceTracing: IServiceTracing);

}