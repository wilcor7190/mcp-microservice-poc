import { Module } from '@nestjs/common';
import { DataProviderModule } from '../data-provider/data-provider.module';
import { ICategoriesUC } from './use-case/categories.uc';
import { CategoriesUCImpl } from './use-case/impl/categories.uc.impl';
import { MessageUcimpl } from './use-case/impl/message.uc.impl';
import { IMessageUc } from './use-case/message.uc';
import { ParamUcimpl } from './use-case/resource/impl/param.resource.uc.impl';
import { ServiceErrorUcimpl } from './use-case/resource/impl/service-error.resource.uc.impl';
import { ServiceTracingUcimpl } from './use-case/resource/impl/service-tracing.resource.uc.impl';
import { IParamUc } from './use-case/resource/param.resource.uc';
import { IServiceErrorUc } from './use-case/resource/service-error.resource.uc';
import { IServiceTracingUc } from './use-case/resource/service-tracing.resource.uc';
import { ClientsModule, Transport } from '@nestjs/microservices';
import generalConfig from '../common/configuration/general.config';
import { CacheModule } from '@nestjs/cache-manager';

/**
 * Obtiene la configuracion y construción principal de la capa de negocio
 * @author Santiago Vargas
 */
@Module({
  imports: [CacheModule.register(), DataProviderModule, ClientsModule.register([
    {
      name: 'KAFKA',
      transport: Transport.KAFKA,
      options: {
        consumer: {
          groupId: generalConfig.kafkaIdGroup,
        },
        client: {
          brokers: [generalConfig.kafkaBroker],
          ssl: false
        }
      }
    }
  ])],
  providers: [
    { provide: IMessageUc, useClass: MessageUcimpl },
    { provide: IParamUc, useClass: ParamUcimpl },
    { provide: IServiceErrorUc, useClass: ServiceErrorUcimpl },
    { provide: IServiceTracingUc, useClass:ServiceTracingUcimpl},
    { provide: ICategoriesUC, useClass: CategoriesUCImpl },
    {
      provide: 'VerifyParams',
      useFactory: async (paramUC: IParamUc) => {
        await paramUC.loadParams();
      },
      inject: [IParamUc]
    },
  ],
  
  exports: [IMessageUc, IParamUc, IServiceErrorUc, IServiceTracingUc, ICategoriesUC],
})
export class CoreModule {}
