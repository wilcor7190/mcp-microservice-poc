/**
 * Clase para la emision del evento Kafka
 * @author Oscar Robayo
 */
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import generalConfig from '../../../common/configuration/general.config';
import Logging from '../../../common/lib/logging';
import { ETaskPrices, Etask } from '../../../common/utils/enums/taks.enum';
import { IEventPricesKafkaUc } from '../eventPricesKafka.uc';
import { ELevelsErros } from '../../../common/utils/enums/logging.enum';
import * as APM from '@claro/general-utils-library';

@Injectable()
export class EventPricesKafkaUcImpl implements IEventPricesKafkaUc {
  constructor(@Inject('KAFKA') private readonly kafka: ClientProxy) {}

  private readonly logger = new Logging(EventPricesKafkaUcImpl.name);

  /**
   * Función que emite el evento Kafka
   */
  async eventPricesKafka() {
    const transaction = await APM.startTransaction(`emitKafkaEvent - Kafka`);
    try {
      let eventPrices = {
        service: 'MSAbCaAlarPricesETL',
        status: 'Created',
      };

      this.kafka.emit(generalConfig.kafkaTopic, eventPrices);
      this.logger.write(
        'emitKafkaEvent()',
        Etask.EMIT_KAFKA,
        ELevelsErros.INFO,
      );
    } catch (error) {
      this.logger.write(
        `pricesEquipmentUc(),${error}`,
        ETaskPrices.ERROR_PROCESS_KAFKA,
        ELevelsErros.ERROR,
      );
    }finally {
      transaction.end();
    }
  }
}
