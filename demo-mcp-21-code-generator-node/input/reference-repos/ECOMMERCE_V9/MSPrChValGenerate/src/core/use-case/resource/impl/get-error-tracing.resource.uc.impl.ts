/**
 * Implementa la validacion para el manejo de errores
 * @author alexisterzer
 */
import { Injectable } from '@nestjs/common';
import { IGetErrorTracingUc } from '../get-error-tracing.resource.uc';
import { ITaskError } from '@claro/generic-models-library';
import Logging from 'src/common/lib/logging';
import utils from 'src/common/utils/GeneralUtil';
import { EDescriptionTracingGeneral, EStatusTracingGeneral, ETaskTracingGeneral } from 'src/common/utils/enums/tracing.enum';
import Traceability from 'src/common/lib/traceability';
import { IServiceErrorUc } from 'src/core/use-case/resource/service-error.resource.uc';
import { IServiceTracingUc } from 'src/core/use-case/resource/service-tracing.resource.uc';
import { ELevelsErros } from 'src/common/utils/enums/logging.enum';
import { Etask} from "src/common/utils/enums/taks.enum";

@Injectable()
export class GetErrorTracingUcimpl implements IGetErrorTracingUc {
    private readonly logger = new Logging(GetErrorTracingUcimpl.name);

    constructor(
        public readonly _serviceError: IServiceErrorUc,
        public readonly _serviceTracing: IServiceTracingUc,
    ) { }


    /**
   * Funcion para registrar los errores
   * @param {any} error error capturado
   */
    async getError(fallo: any): Promise<void> {
        try {
            let task: ITaskError = {
                taskName: fallo?.task_name || '',
                taskDescription: fallo?.task_description || '',
                description: fallo.description
            }

            await this._serviceError.createServiceError(fallo, task);

        } catch (error) {
            this.logger.write('Error ocurrido al guardar datos en coll_service_error', Etask.SAVE_DATA, ELevelsErros.ERROR);

        } 

    }

    /**
   * Funcion para registrar la trazabilidad
   * @param {EStatusTracingGeneral} status Estado de la trazabilidad
   * @param {EDescriptionTracingGeneral}description Descripcion de la tarea
   * @param {ETaskTracingGeneral}task Nombre de la tarea
   */
    async createTraceability(   
        status: EStatusTracingGeneral,
        description: EDescriptionTracingGeneral | string,
        task: ETaskTracingGeneral
    ): Promise<void> {
        try {
           let traceability = new Traceability({});
            traceability.setTransactionId(utils.getCorrelationalId);
            traceability.setStatus(status);
            traceability.setDescription(description);
            traceability.setTask(task);
            await this._serviceTracing.createServiceTracing(traceability.getTraceability()); 
        } catch (error) {
            this.logger.write(error, Etask.SAVE_DATA, ELevelsErros.ERROR);
            this.logger.write('Error ocurrido al guardar datos en coll_traceability', Etask.SAVE_DATA, ELevelsErros.ERROR);

        }
        
    }





}
