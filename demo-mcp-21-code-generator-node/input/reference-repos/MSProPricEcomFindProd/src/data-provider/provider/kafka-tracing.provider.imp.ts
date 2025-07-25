import { Inject, Injectable } from '@nestjs/common';
import { IServiceTracingProvider } from '../service-tracing.provider';
import { ClientProxy } from '@nestjs/microservices';
import { IServiceTracing, IServiceTracingInicial } from 'src/core/entity/service-tracing/service-tracing.entity';
import { TraceEvent } from 'src/controller/dto/trace-event/trace-event.dto';
import { v4 as uuidv4 } from 'uuid';
import { ETraceStatus } from 'src/common/utils/enums/tracing.enum';
import kafkaConfig from 'src/common/configuration/kafka.config';
import { IServiceErrorUc } from 'src/core/use-case/resource/service-error.resource.uc';
import { ITaskError } from 'src/core/entity/service-error/task-error.entity';
import { firstValueFrom } from 'rxjs';
import { assignTaskError, startSpan } from '@claro/general-utils-library';
import { ETaskDesc, Etask } from 'src/common/utils/enums/taks.enum';
import { MappingApiRest } from 'src/common/utils/enums/mapping-api-rest';
import { ELevelsErros } from 'src/common/utils/enums/logging.enum';

@Injectable()
export class KafkaTracingProvider implements IServiceTracingProvider {
  constructor(
    @Inject('KAFKA') private readonly kafka: ClientProxy,
    private readonly serviceError: IServiceErrorUc
  ) { }

  /**
   * Operación de inserción de la trazabilidad de los ms
   * @param {IServiceTracing} serviceTracing arreglo con información la trazabilidad de
   */
  async createServiceTracing(serviceTracing: IServiceTracing): Promise<void> {
    let spanIn:any;
    try {
      spanIn = startSpan(KafkaTracingProvider.name, MappingApiRest.DB, 'createServiceTracing', Etask.APM )
      let traceEvent = this.mapServiceTracingToTraceEvent(serviceTracing);
      await firstValueFrom(this.kafka.emit(kafkaConfig.topic, traceEvent)).catch((err) => {
        assignTaskError(err, Etask.TRACE_KAFKA, ETaskDesc.TRACE_KAFKA);
        throw err;
      });
    } catch (error) {
      let task: ITaskError = {
        task_name: error?.task_name || '',
        task_description: error?.task_description || '',
        description: error
      };
      let tracingInfoPrincipal: IServiceTracingInicial = {
        id: serviceTracing.transactionId,
        origen: serviceTracing.origen
      };
      this.serviceError.createServiceError(error, task, serviceTracing, tracingInfoPrincipal, ELevelsErros.ERROR);
    } finally {
      if (spanIn) spanIn.end();
    }
  }

  /**
   * Mapea la infornación de trazabilidad al objeto TraceEvent
   * @param serviceTracing Objeto de trazabilidad
   * @returns {TraceEvent} Objento de evento de trazabilidad
   */
  mapServiceTracingToTraceEvent(serviceTracing: IServiceTracing): TraceEvent {
    let status: ETraceStatus = ETraceStatus.INFO;
    if (
      serviceTracing?.status?.includes('ERROR') ||
      serviceTracing?.status?.includes('WARN') ||
      serviceTracing?.status?.includes('FAILED')
    )
      status = ETraceStatus.FAILED;
    if (
      serviceTracing?.status?.includes('SUCCESS')
    )
      status = ETraceStatus.SUCCESS;
    return {
      eventId: uuidv4(),
      eventType: kafkaConfig.eventType,
      eventTime: new Date(),
      event: {
        transactionId: serviceTracing?.transactionId,
        traceabilityStatus: status,
        task: serviceTracing?.task || '',
        description: serviceTracing?.description || '',
        origen: serviceTracing?.origen || '',
        request: serviceTracing?.request || '',
        response: serviceTracing?.response || '',
        processingTime: serviceTracing?.processingTime || -1,
        collectionName: kafkaConfig.collectionTrace
      }
    };
  }
}
