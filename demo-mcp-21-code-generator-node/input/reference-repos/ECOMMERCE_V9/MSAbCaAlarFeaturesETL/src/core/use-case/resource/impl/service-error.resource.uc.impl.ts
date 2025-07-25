import { Injectable } from '@nestjs/common';
import { IServiceError } from '@claro/generic-models-library';
import { IServiceErrorProvider } from '../../../../data-provider/service-error.provider';
import { IServiceErrorUc } from '../service-error.resource.uc';
import { GlobalReqOrigin } from '../../../../common/configuration/general.config';
import { BusinessException } from '../../../../common/lib/business-exceptions';
import { ITaskError } from '../../../../core/entity/service-error/task-error.entity';
import Logging from '../../../../common/lib/logging';

/**
 * Clase para el manejo de errores en el ms
 * @author Santiago Vargas
 */
@Injectable()
export class ServiceErrorUcimpl implements IServiceErrorUc {
  constructor(private readonly _serviceErrorProvider: IServiceErrorProvider) {}
  private readonly logger = new Logging(ServiceErrorUcimpl.name);

  async createServiceError(error: any, task: ITaskError) {
    try {
      this.logger.write(task.description, task.name, GlobalReqOrigin.request);

      if (error instanceof BusinessException) {
        throw error;
      }
      const dataError: IServiceError = {
        origin: GlobalReqOrigin.globalOrigin,
        message: error.message,
        stack: error.stack,
        request: GlobalReqOrigin.request,
        channel: GlobalReqOrigin.requestHeaders,
      };
      await this._serviceErrorProvider.createServiceError(dataError);
    } catch (err) {
      this.logger.write(
        'ERROR: ServiceError() ' + task.description,
        err,
        GlobalReqOrigin.request || '',
        err.stack,
      );
    }
  }
}
