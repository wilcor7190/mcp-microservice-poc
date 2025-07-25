/**
 * Clase para realizar la orquestación de dataload por eventos
 * @author Santiago Vargas
 */

import { Injectable } from '@nestjs/common';
import * as APM from '@claro/general-utils-library';
import Logging from '../../../common/lib/logging';
import Traceability from '../../../common/lib/traceability';
import { ETaskDesc, Etask } from '../../../common/utils/enums/taks.enum';
import { EDescriptionTracingGeneral, EStatusTracingGeneral, ETaskTracingGeneral } from '../../../common/utils/enums/tracing.enum';
import { IOrchDataloadUC } from '../../../core/use-case/orch-dataload.uc';
import { IServiceErrorUc } from '../../../core/use-case/resource/service-error.resource.uc';
import { IServiceTracingUc } from '../../../core/use-case/resource/service-tracing.resource.uc';
import { IEventsService } from '../events.service';
import { ELevelsErros } from '../../../common/utils/enums/logging.enum';

@Injectable()
export class EventsService implements IEventsService {

  constructor(
    private readonly orchDataloadUC: IOrchDataloadUC,
    public readonly _serviceError: IServiceErrorUc,
    public readonly _serviceTracing: IServiceTracingUc,
  ) { }

  private readonly logger = new Logging(EventsService.name);

  /**
   * Operación para orquestar la creación del dataload
   * 
   * @param {String} family Familia para filtrar los dataloads a generar
   */
  async orchDataloadKafka(family: string) {
    const transaction = await APM.startTransaction(`orchDataloadKafka - Kafka`);
    this.createTraceability(
      EStatusTracingGeneral.STATUS_SUCCESS,
      ETaskDesc.START_EVENT, 
      Etask.PROCESS_KAFKA_EVENT,
      family
    );
    try {
          
      switch (family) {
        case "features":
            await this.orchDataloadUC.orchDataload({ dataload: "Product-Data" });
            await this.orchDataloadUC.orchDataload({ dataload: "Attributes-Products" });
            await this.orchDataloadUC.orchDataload({ dataload: "Attributes-Dictionary" });
            await this.orchDataloadUC.orchDataload({ dataload: "Attachments-Data" });
          break;

        case "prices":
            await this.orchDataloadUC.orchDataload({ dataload: "Price-List" });
          break;

        case "disponibility":
            await this.orchDataloadUC.orchDataload({ dataload: "Product-Inventory" });
          break;

        default:
          this.logger.write('orchDataloadKafka()', `${Etask.PROCESS_KAFKA_ERROR_EVENT}, ${family}`);
          break;
      }

    } catch (error) {
      this.logger.write(ETaskDesc.ERROR_KAFKA_EVENT, Etask.PROCESS_KAFKA_EVENT);
      this._serviceError.createServiceError(error, 
        {taskName: Etask.PROCESS_KAFKA_EVENT, taskDescription: ETaskDesc.ERROR_KAFKA_EVENT}
      )
    }finally {
      this.createTraceability(
        EStatusTracingGeneral.STATUS_SUCCESS,
        ETaskDesc.FINISH_EVENT, 
        Etask.FINISH_KAFKA_EVENT,
        family);
      transaction.end();
    }
  }

  /**
   * Funcion para registrar la trazabilidad
   * @param {EStatusTracingGeneral} status Estado de la trazabilidad
   * @param {EDescriptionTracingGeneral}description Descripcion de la tarea
   * @param {ETaskTracingGeneral}task Nombre de la tarea
   */
  private async createTraceability(
    status: EStatusTracingGeneral,
    description: EDescriptionTracingGeneral | ETaskDesc,
    task: ETaskTracingGeneral | Etask,
    request?: string,
  ): Promise<void> {
    this.logger.write(description, task, ELevelsErros.INFO, request ?? request);

    let traceability = new Traceability({});
    traceability.setStatus(status);
    traceability.setTask(description);
    traceability.setRequest(request);
    await this._serviceTracing.createServiceTracing(
      traceability.getTraceability(),
    );
  }
}