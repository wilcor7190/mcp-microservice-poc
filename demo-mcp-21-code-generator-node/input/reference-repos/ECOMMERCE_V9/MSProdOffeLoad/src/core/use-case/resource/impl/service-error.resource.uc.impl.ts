/**
 * Implementa la validacion para el manejo de errores
 * @author alexisterzer
 */
import { Injectable } from '@nestjs/common';
import { IServiceErrorUc } from '../service-error.resource.uc';
import { IServiceErrorProvider } from '../../../../data-provider/service-error.provider';
import Logging from '../../../../common/lib/logging';
import { ELevelsErros } from '../../../../common/utils/enums/logging.enum';
import {
  IServiceError,
  IServiceTracingInitial,
  ITaskError,
} from '@claro/generic-models-library';

@Injectable()
export class ServiceErrorUcimpl implements IServiceErrorUc {
  private readonly logger = new Logging(ServiceErrorUcimpl.name);

  constructor(private readonly _serviceErrorProvider: IServiceErrorProvider) {}
  /**
   * Funcion para la creación de errores en los ms
   * @param {Object} error arreglo información de error
   * @param {ITaskError} task Identificador de la tarea donde se genero el error
   * @param {IServiceTracingInicial} tracingInfoPrincipal arreglo información adicional donde se genero el error
   */
  async createServiceError(
    error: any,
    task: ITaskError,
    request?: any,
    tracingInfoPrincipal?: IServiceTracingInitial,
    nivel?: ELevelsErros,
  ) {
    try {
      const dataError: IServiceError = {
        success: error.success || false,
        serviceId: tracingInfoPrincipal.id,
        origin: tracingInfoPrincipal.origin,
        method: tracingInfoPrincipal.method,
        task: task,
        message: error.message,
        channel: tracingInfoPrincipal.channel,
        stack: error.stack,
        request: request,
        response: tracingInfoPrincipal.response,
      };
      this.logger.write(
        'ERROR: ServiceError() ' + task.taskDescription,
        task.taskName,
        request || '',
        error.stack,
      );
      await this._serviceErrorProvider.createServiceError(dataError);
    } catch (err) {
      this.logger.write(
        'ERROR: ServiceError() ' + task.taskDescription,
        err,
        request || '',
        err.stack,
      );
    }
  }
}
