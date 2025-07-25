import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceTracingUcimpl } from 'src/core/use-case/resource/impl/service-tracing.resource.uc.impl';
import { IServiceTracingUc } from 'src/core/use-case/resource/service-tracing.resource.uc';
import databaseConfig from '../common/configuration/database.config';
import { IMessageProvider } from './message.provider';
import { MessageModel, MessageSchema } from './model/message.model';
import { ParamModel, ParamSchema } from './model/param/param.model';
import { ServiceErrorModel, ServiceErrorSchema } from './model/service-error/service-error.model';
import { IParamProvider } from './param.provider';
import { MessageProvider } from './provider/message.provider.impl';
import { ParamProvider } from './provider/param.provider.impl';
import { ServiceErrorProvider } from './provider/service-error.provider.impl';
import { IServiceErrorProvider } from './service-error.provider';
import { IServiceTracingProvider } from './service-tracing.provider';
import { IHttpProvider } from './http.provider';
import { HttpProvider } from './provider/http.provider.impl';
import { ClientsModule, Transport } from '@nestjs/microservices';
import kafkaConfig from 'src/common/configuration/kafka.config';
import { KafkaTracingProvider } from './provider/kafka-tracing.provider.imp';
import { IServiceErrorUc } from 'src/core/use-case/resource/service-error.resource.uc';
import { ServiceErrorUcimpl } from 'src/core/use-case/resource/impl/service-error.resource.uc.impl';

@Module({
  imports: [
    //Conexión a base de datos
    MongooseModule.forRoot(databaseConfig.database, {
      retryAttempts: 3,
      autoCreate: false,
      autoIndex: false
    }),
    MongooseModule.forFeature([
      { name: MessageModel.name, schema: MessageSchema, collection: 'coll_message'},
      { name: ParamModel.name, schema: ParamSchema, collection: 'coll_params' },
      { name: ServiceErrorModel.name, schema: ServiceErrorSchema, collection: 'coll_service_error' },
    ]),
    HttpModule,
    ClientsModule.register([
      {
        name: 'KAFKA',
        transport: Transport.KAFKA,
        options: {
          consumer: { groupId: kafkaConfig.groupId },
          client: {
            brokers: [kafkaConfig.broker],
            ssl: false,
            retry: { retries: kafkaConfig.retries, maxRetryTime: 1000 },
            reauthenticationThreshold: kafkaConfig.delayRetry
          }
        }
      }
    ]),
  ],
  providers: [
    { provide: IMessageProvider, useClass: MessageProvider },
    { provide: IParamProvider, useClass: ParamProvider },
    { provide: IServiceErrorProvider, useClass: ServiceErrorProvider },
    { provide: IServiceTracingProvider, useClass: KafkaTracingProvider },
    { provide: IServiceTracingUc, useClass: ServiceTracingUcimpl},
    { provide: IServiceErrorUc, useClass: ServiceErrorUcimpl },
    { provide: IHttpProvider, useClass: HttpProvider},
    HttpModule
  ],
  exports: [IMessageProvider, IParamProvider, IServiceErrorProvider, IServiceTracingProvider, IServiceTracingUc, HttpModule, IServiceErrorUc, IHttpProvider],
})
export class DataProviderModule {}
