/**
 * Implementa la validacion para el manejo de errores
 * @author alexisterzer
 */
import { Injectable } from '@nestjs/common';
import { IServiceError , ITaskError } from '@claro/generic-models-library';
import { IServiceErrorProvider } from 'src/data-provider/service-error.provider';
import { IServiceErrorUc } from '../service-error.resource.uc';
import Logging from 'src/common/lib/logging';
import { ELevelsErros } from 'src/common/utils/enums/logging.enum';
import { GlobalReqOrigin } from '../../../../common/configuration/general.config';

@Injectable()
export class ServiceErrorUcimpl implements IServiceErrorUc {
    private readonly logger = new Logging(ServiceErrorUcimpl.name);  
    
    constructor(
        private readonly _serviceErrorProvider: IServiceErrorProvider
    ) { }
    /** 
    * Funcion para la creación de errores en los ms
    * @param {Object} error arreglo información de error
    * @param {ITaskError} task Identificador de la tarea donde se genero el error
    * @param {IServiceTracingInicial} tracingInfoPrincipal arreglo información adicional donde se genero el error
    */
    async createServiceError(error: any, task: ITaskError): Promise<void> {
        this.logger.write(
          error.message,
          task,
          ELevelsErros.ERROR,
          GlobalReqOrigin.request,
        );
        
        const dataError: IServiceError = {
          origin: GlobalReqOrigin.globalOrigin,
          message: error.message,
          stack: error.stack,
          request: GlobalReqOrigin.request,
          channel: GlobalReqOrigin.requestHeaders, 
          task: task
        };
        return this._serviceErrorProvider.createServiceError(dataError);
      }
    
}
