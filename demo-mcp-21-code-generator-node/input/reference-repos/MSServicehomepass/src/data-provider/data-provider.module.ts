/**
 * Obtiene la configuraciones a bases de datos, colleciones y construción principal
 * de la capa que interactua con los proveedores exteriores
 * @author Oscar Alvarez
 */
import { OracleProvider } from './provider/oracle.provider.impl';
import { CusRequestHomePassModel, CusRequestHomePassSchema } from './model/CusRequestHomepass/cusRequestHomePass.model';
import { CusRequestHomePassProvider } from './provider/cusRequestHomePass.provider.impl';
import { HomePassProviderimpl } from './provider/homepass.provider.impl';
import { HttpProvider } from './provider/http.provider.impl';
import { IOracleProvider } from './oracle.provider';
import { ICusRequestHomePassProvider } from './cusRequestHomePass.provider';
import { IHomePass } from './homePass.provider';
import { IHttpProvider } from './http.provider';
import { IMessageProvider } from './message.provider';
import { IParamProvider } from './param.provider';
import { IPutClientHomePassProvider } from './PutClientHomePass.provider';
import { IServiceErrorProvider } from './service-error.provider';
import { IServiceErrorUc } from '../core/use-case/resource/service-error.resource.uc';
import { IServiceTracingProvider } from './service-tracing.provider';
import { MessageProvider } from './provider/message.provider.impl';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ParamProvider } from './provider/param.provider.impl';
import { PutClientHomePassProvider } from './provider/putClientHomePass.provider.impl';
import { ServiceErrorProvider } from './provider/service-error.provider.impl';
import { ServiceErrorUcimpl } from '../core/use-case/resource/impl/service-error.resource.uc.impl';
import { ServiceTracingProvider } from './provider/service-tracing.provider.impl';
import databaseConfig from '../common/configuration/database.config';
import { IServiceTracingUc } from 'src/core/use-case/resource/service-tracing.resource.uc';
import { ServiceTracingUcimpl } from 'src/core/use-case/resource/impl/service-tracing.resource.uc.impl';
import { MessageModel, MessageSchema, ParamModel, ParamSchema, ServiceErrorModel, ServiceErrorSchema, ServiceTracingModel, ServiceTracingSchema } from '@claro/generic-models-library';

@Module({
  imports: [
    MongooseModule.forRoot(databaseConfig.database, {
      retryAttempts: 3,
      autoCreate: false,
      autoIndex: false,
    }),
    MongooseModule.forFeature([
      {
        name: MessageModel.name,
        schema: MessageSchema,
        collection: 'coll_message',
      },
      {
        name: ParamModel.name,
        schema: ParamSchema,
        collection: 'coll_params',
      },
      {
        name: ServiceErrorModel.name,
        schema: ServiceErrorSchema,
        collection: 'coll_service_error',
      },
      {
        name: CusRequestHomePassModel.name,
        schema: CusRequestHomePassSchema,
        collection: 'CusRequestHomepass',
      },
      { name: ServiceTracingModel.name, schema: ServiceTracingSchema, collection: 'coll_traceability' },
    ]),
  ],
  providers: [
    { provide: IMessageProvider, useClass: MessageProvider },
    { provide: IParamProvider, useClass: ParamProvider },
    { provide: IHttpProvider, useClass: HttpProvider },
    { provide: IServiceErrorProvider, useClass: ServiceErrorProvider },
    { provide: ICusRequestHomePassProvider, useClass: CusRequestHomePassProvider },
    { provide: IPutClientHomePassProvider, useClass: PutClientHomePassProvider },
    { provide: IOracleProvider, useClass: OracleProvider },
    { provide: IHomePass, useClass: HomePassProviderimpl },
    { provide: IServiceTracingProvider, useClass: ServiceTracingProvider },
    { provide: IServiceErrorUc, useClass: ServiceErrorUcimpl },
    { provide: IServiceTracingUc, useClass: ServiceTracingUcimpl },
  ],
  exports: [
    IMessageProvider,
    IServiceErrorUc,
    IServiceTracingProvider,
    IParamProvider,
    IServiceErrorProvider,
    ICusRequestHomePassProvider,
    IHomePass,
    IPutClientHomePassProvider,
    IOracleProvider,
  ],
})
export class DataProviderModule {}
