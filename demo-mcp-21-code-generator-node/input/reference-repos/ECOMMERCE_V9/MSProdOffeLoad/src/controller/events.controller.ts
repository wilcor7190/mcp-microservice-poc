/**
 * Clase donde se definen los metodos a exponer por parte del servicio para los metodos de eventos
 * @author Santiago Vargas
 */

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { TraceabilityDecorator } from '@claro/general-utils-library';
import generalConfig from '../common/configuration/general.config';
import { ETaskDesc, Etask } from '../common/utils/enums/taks.enum';
import { IEventsService } from './service/events.service';
import { IServiceErrorUc } from '../core/use-case/resource/service-error.resource.uc';
import Logging from '../common/lib/logging';
import { ELevelsErros } from '../common/utils/enums/logging.enum';

@ApiTags(`${generalConfig.controllerEvents}`)
@Controller(`${generalConfig.apiVersion}${generalConfig.controllerEvents}`)
export class EventsController {
  private readonly logger = new Logging(EventsController.name);

  constructor(
    private readonly _eventService: IEventsService,
    public readonly _serviceError: IServiceErrorUc,
  ) {}

  @MessagePattern(generalConfig.kafkaTopicFeatures)
  @TraceabilityDecorator()
  async onFeatureCalendarAlarmEvent(@Payload() payload: any) {
    this.logger.write(
      `onFeatureCalendarAlarmEvent() | ${ETaskDesc.KAFKA_EVENT_FEATURES}`,
      Etask.PROCESS_KAFKA_EVENT,
      ELevelsErros.INFO,
      payload,
    );

    this._eventService.orchDataloadKafka('features');
  }

  @MessagePattern(generalConfig.kafkaTopicPrices)
  @TraceabilityDecorator()
  async onPricesCalendarAlarmEvent(@Payload() payload: any) {
    this.logger.write(
      `OnPricesCalendarAlarmEvent() | ${ETaskDesc.KAFKA_EVENT_PRICES}`,
      Etask.PROCESS_KAFKA_EVENT,
      ELevelsErros.INFO,
      payload,
    );

    this._eventService.orchDataloadKafka('prices');
  }

  @MessagePattern(generalConfig.kafkaTopicDisponibility)
  @TraceabilityDecorator()
  async onDisponibilityCalendarAlarmEvent(@Payload() payload: any) {
    this.logger.write(
      `onDisponibilityCalendarAlarmEvent() | ${ETaskDesc.KAFKA_EVENT_DISPONIBILITY}`,
      Etask.PROCESS_KAFKA_EVENT,
      ELevelsErros.INFO,
      payload,
    );

    this._eventService.orchDataloadKafka('disponibility');
  }
}
