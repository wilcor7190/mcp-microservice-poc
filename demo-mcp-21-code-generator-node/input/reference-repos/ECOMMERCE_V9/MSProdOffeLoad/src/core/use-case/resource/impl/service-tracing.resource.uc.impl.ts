/**
 * implementa la configuracion del tracing
 * @author uriel esguerra
 */
import { Injectable } from '@nestjs/common';
import { IServiceTracing } from '@claro/generic-models-library';
import { IServiceTracingProvider } from '../../../../data-provider/service-tracing.provider';
import { IServiceTracingUc } from '../service-tracing.resource.uc';
import utils from '../../../../common/utils/generalUtil';
import Logging from '../../../../common/lib/logging';
import { Etask } from '../../../../common/utils/enums/taks.enum';

@Injectable()
export class ServiceTracingUcimpl implements IServiceTracingUc {
  private readonly logger = new Logging(ServiceTracingUcimpl.name);

  constructor(
    private readonly _serviceTracingProvider: IServiceTracingProvider,
  ) {}

  async createServiceTracing(serviceTracing: IServiceTracing) {
    try {
      serviceTracing.transactionId = utils.getCorrelationalId;
      await this._serviceTracingProvider.createServiceTracing(serviceTracing);
    } catch (error) {
      this.logger.write(
        error.message + ':  ' + JSON.stringify(error.stack),
        Etask.ERROR_TRACE,
      );
    }
  }
}
