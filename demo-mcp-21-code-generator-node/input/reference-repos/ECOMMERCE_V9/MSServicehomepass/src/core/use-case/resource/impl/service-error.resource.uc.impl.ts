/**
 * Clase que se implementa para gestion de registro de errores
 * @author Juan David Marin
 */
import { Injectable } from '@nestjs/common';
import { IServiceErrorProvider } from '../../../../data-provider/service-error.provider';
import { IServiceErrorUc } from '../service-error.resource.uc';
import Logging from '../../../../common/lib/logging';
import { ELevelsErrors } from 'src/common/utils/enums/logging.enum';
import { IServiceError, IServiceTracingInitial, ITaskError } from '@claro/generic-models-library';

@Injectable()
export class ServiceErrorUcimpl implements IServiceErrorUc {
  constructor(private readonly _serviceErrorProvider: IServiceErrorProvider) {}
  private readonly logger = new Logging(ServiceErrorUcimpl.name);

  /**
   * Funcion para la creación de errores en los ms
   * @param {Object} error arreglo información de error
   * @param {ITaskError} task Identificador de la tarea donde se genero el error
   * @param {IServiceTracingInitial} tracingInfoPrincipal arreglo información adicional donde se genero el error
   */
  async createServiceError(error: any, task: ITaskError, request: any, tracingInfoPrincipal: IServiceTracingInitial, nivel: ELevelsErrors) {
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
    this.logger.write('ERROR: ServiceError() ' + task.taskDescription, task.taskName, nivel, request || '', error.stack);
    this._serviceErrorProvider.createServiceError(dataError);
  }
}
