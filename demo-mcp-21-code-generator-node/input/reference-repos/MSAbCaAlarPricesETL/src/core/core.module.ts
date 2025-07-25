/**
 * Obtiene la configuracion y construción principal de la capa de negocio
 * @author Oscar Robayo
 */
import { Module } from '@nestjs/common';
import { DataProviderModule } from '../data-provider/data-provider.module';
import { MessageUcimpl } from './use-case/impl/message.uc.impl';
import { IMessageUc } from './use-case/message.uc';
import { ParamUcimpl } from './use-case/resource/impl/param.resource.uc.impl';
import { ServiceErrorUcimpl } from './use-case/resource/impl/service-error.resource.uc.impl';
import { ServiceTracingUcimpl } from './use-case/resource/impl/service-tracing.resource.uc.impl';
import { IParamUc } from './use-case/resource/param.resource.uc';
import { IServiceErrorUc } from './use-case/resource/service-error.resource.uc';
import { IServiceTracingUc } from './use-case/resource/service-tracing.resource.uc';
import { OrchPricesUcImpl } from './use-case/impl/orch-prices.uc.impl';
import { IOrchPricesUc } from './use-case/orch-prices.uc';
import { ClientsModule, Transport } from '@nestjs/microservices';
import generalConfig from '../common/configuration/general.config';
import { IEventPricesKafkaUc } from './use-case/eventPricesKafka.uc';
import { EventPricesKafkaUcImpl } from './use-case/impl/eventPricesKafka.uc.impl';
import { IPricesHelper } from './use-case/prices-helper.uc';
import { PricesHelperUcImpl } from './use-case/impl/prices-helper.uc.impl';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register(),
    DataProviderModule,
    ClientsModule.register([
      {
        name: 'KAFKA',
        transport: Transport.KAFKA,
        options: {
          consumer: {
            groupId: generalConfig.kafkaIdGroup,
          },
          client: {
            brokers: [generalConfig.kafkaBroker],
            ssl: false,
          },
        },
      },
    ]),
  ],
  providers: [
    { provide: IMessageUc, useClass: MessageUcimpl },
    { provide: IParamUc, useClass: ParamUcimpl },
    { provide: IServiceErrorUc, useClass: ServiceErrorUcimpl },
    { provide: IServiceTracingUc, useClass: ServiceTracingUcimpl },
    { provide: IOrchPricesUc, useClass: OrchPricesUcImpl },
    { provide: IEventPricesKafkaUc, useClass: EventPricesKafkaUcImpl },
    { provide: IPricesHelper, useClass: PricesHelperUcImpl },
    {
      provide: 'VerifyParams',
      useFactory: async (paramUC: IParamUc) => {
        await paramUC.loadParams();
      },
      inject: [IParamUc],
    },
  ],

  exports: [
    IMessageUc,
    IParamUc,
    IServiceErrorUc,
    IServiceTracingUc,
    IOrchPricesUc,
    IEventPricesKafkaUc,
  ],
})
export class CoreModule {}
