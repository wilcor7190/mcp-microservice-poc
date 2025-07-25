/**
 * implementa la configuracion del tracing
 * @author uriel esguerra
 */
import { Injectable } from '@nestjs/common';
import { IServiceTracing } from '@claro/generic-models-library';
import { IServiceTracingProvider } from 'src/data-provider/service-tracing.provider';
import { IServiceTracingUc } from '../service-tracing.resource.uc';

@Injectable()
export class ServiceTracingUcimpl implements IServiceTracingUc {

    constructor(
        private readonly _serviceTracingProvider: IServiceTracingProvider
    ) { }

    async createServiceTracing(serviceTracing: IServiceTracing) {
        await this._serviceTracingProvider.createServiceTracing(serviceTracing);
    }

}
