import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import databaseConfig from '../common/configuration/database.config';
import { IHttpPruebaProvider } from './http-prueba.provider';
import { IHttpProvider } from './http.provider';
import { IMessageProvider } from './message.provider';
import { MessageModel, MessageSchema } from './model/message.model';
import { ParamModel, ParamSchema } from './model/param/param.model';
import { ServiceErrorModel, ServiceErrorSchema } from './model/service-error/service-error.model';
import { ServiceTracingModel, ServiceTracingSchema } from './model/service-tracing/service-tracing.model';
import { IParamProvider } from './param.provider';
import { HttpPruebaProvider } from './provider/http-prueba.provider.impl';
import { HttpProvider } from './provider/http.provider.impl';
import { MessageProvider } from './provider/message.provider.impl';
import { ParamProvider } from './provider/param.provider.impl';
import { ServiceErrorProvider } from './provider/service-error.provider.impl';
import { ServiceTracingProvider } from './provider/service-tracing.provider.impl';
import { IServiceErrorProvider } from './service-error.provider';
import { IServiceTracingProvider } from './service-tracing.provider';

@Module({
  imports: [
    //Conexión a base de datos
    MongooseModule.forRoot(databaseConfig.database, {
      retryAttempts: 3,
      useCreateIndex: true,
      useFindAndModify: false,
      autoCreate: false,
      autoIndex: false
    }),
    MongooseModule.forFeature([
      { name: MessageModel.name, schema: MessageSchema, collection: 'coll_message'},
      { name: ParamModel.name, schema: ParamSchema, collection: 'coll_params' },
      { name: ServiceErrorModel.name, schema: ServiceErrorSchema, collection: 'coll_service_error' },
      { name: ServiceTracingModel.name, schema: ServiceTracingSchema, collection: 'coll_traceability' },
    ])
  ],
  providers: [
    { provide: IMessageProvider, useClass: MessageProvider },
    { provide: IHttpProvider, useClass: HttpProvider },
    { provide: IHttpPruebaProvider, useClass: HttpPruebaProvider },
    { provide: IParamProvider, useClass: ParamProvider },
    { provide: IServiceErrorProvider, useClass: ServiceErrorProvider },
    { provide: IServiceTracingProvider, useClass: ServiceTracingProvider },
  ],
  exports: [IMessageProvider, IHttpPruebaProvider, IParamProvider, IServiceErrorProvider, IServiceTracingProvider],
})
export class DataProviderModule {}
