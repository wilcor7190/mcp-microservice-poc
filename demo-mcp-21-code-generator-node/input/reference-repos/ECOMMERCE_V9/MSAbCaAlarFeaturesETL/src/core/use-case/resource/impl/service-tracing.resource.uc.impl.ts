import { Injectable } from '@nestjs/common';
import { IServiceTracing } from '@claro/generic-models-library';
import { IServiceTracingUc } from '../service-tracing.resource.uc';
import { IServiceTracingProvider } from '../../../../data-provider/service-tracing.provider';
import utils from '../../../../common/utils/GeneralUtil';
import Logging from '../../../../common/lib/logging';
import { Etask } from '../../../../common/utils/enums/taks.enum';

/**
 * Clase para el manejo de trazabilidad en el ms
 * @author Santiago Vargas
 */
@Injectable()
export class ServiceTracingUcimpl implements IServiceTracingUc {
  private readonly logger = new Logging(ServiceTracingUcimpl.name);

  constructor(
    private readonly _serviceTracingProvider: IServiceTracingProvider,
  ) {}

  /**
   * Lógica creación de trazabilidad en los ms
   * @param {IServiceTracing} serviceTracing objeto información de trazabilidad
   */
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
