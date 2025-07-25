import { Injectable } from '@nestjs/common';
import { IServiceTracingProvider } from '../../../../data-provider/service-tracing.provider';
import { IServiceTracingUc } from '../service-tracing.resource.uc';
import Logging from '../../../../common/lib/logging';
import { GlobalReqOrigin } from '../../../../common/configuration/general.config';
import { ELevelsErros } from '../../../../common/utils/enums/logging.enum';
import { IServiceTracing } from '@claro/generic-models-library';

@Injectable()
export class ServiceTracingUcimpl implements IServiceTracingUc {
  constructor(
    private readonly _serviceTracingProvider: IServiceTracingProvider,
  ) {}
  private readonly logger = new Logging(ServiceTracingUcimpl.name);

  async createServiceTracing(
    serviceTracing: IServiceTracing,
    level?: ELevelsErros,
    processingTime?: number
  ): Promise<void> {
    try {
      this.logger.write(
        serviceTracing.description,
        serviceTracing.task,
        level,
        GlobalReqOrigin.request,
        '',
        processingTime
      );
      serviceTracing.origin = GlobalReqOrigin.globalOrigin;
      await this._serviceTracingProvider.createServiceTracing(serviceTracing);
    } catch (error) {
      this.logger.write(
        error.description,
        error.task,
        level,
        GlobalReqOrigin.request,
      );
    }
  }
}
