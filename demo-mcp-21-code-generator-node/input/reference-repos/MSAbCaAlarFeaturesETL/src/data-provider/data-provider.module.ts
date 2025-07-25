import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import databaseConfig from '../common/configuration/database.config';
import { ServiceErrorUcimpl } from '../core/use-case/resource/impl/service-error.resource.uc.impl';
import { IServiceErrorUc } from '../core/use-case/resource/service-error.resource.uc';
import { ICategoriesProvider } from './categories.provider';
import { IMessageProvider } from './message.provider';
import {
  EquipmentModel,
  EquipmentSchema,
} from './model/categories/equipment.model';
import { HomeModel, HomeSchema } from './model/categories/home.model';
import { PospagoModel, PospagoSchema } from './model/categories/pospago.model';
import { PrepagoModel, PrepagoSchema } from './model/categories/prepago.model';
import {
  TechnologyModel,
  TechnologySchema,
} from './model/categories/technology.model';
import { ContingencyModel, ContingencySchema } from './model/contingency.model';
import {
  ParentsChildsModel,
  ParentsChildsSchmea,
} from './model/parentsChilds.model';
import { IParamProvider } from './param.provider';
import { IParentsProvider } from './parents.provider';
import { CategoriesProviderImpl } from './provider/categories.provider.impl';
import { MessageProvider } from './provider/message.provider.impl';
import { ParamProvider } from './provider/param.provider.impl';
import { ParentsProviderImpl } from './provider/parents.provider.impl';
import { ServiceErrorProvider } from './provider/service-error.provider.impl';
import { ServiceTracingProvider } from './provider/service-tracing.provider.impl';
import { IServiceErrorProvider } from './service-error.provider';
import { IServiceTracingProvider } from './service-tracing.provider';
import {
  MessageModel,
  MessageSchema,
  ParamModel,
  ParamSchema,
  ServiceErrorModel,
  ServiceErrorSchema,
  ServiceTracingModel,
  ServiceTracingSchema,
} from '@claro/generic-models-library';
import { ParentsTemporaryModel, ParentsTemporarySchema } from './model/parents.model';

@Module({
  imports: [
    //Conexión a base de datos
    MongooseModule.forRoot(databaseConfig.database, {
      retryAttempts: 3,
      autoCreate: false,
      autoIndex: false,
      connectionName: databaseConfig.dbFeatures,
    }),

    MongooseModule.forRoot(databaseConfig.databaseContingency, {
      retryAttempts: 3,
      autoCreate: false,
      autoIndex: false,
      connectionName: databaseConfig.dbContingency,
    }),

    MongooseModule.forFeature(
      [
        {
          name: ContingencyModel.name,
          schema: ContingencySchema,
          collection: 'COLPRTPRODUCTOFFERING',
        },
      ],
      databaseConfig.dbContingency,
    ),

    MongooseModule.forFeature(
      [
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
          name: ServiceTracingModel.name,
          schema: ServiceTracingSchema,
          collection: 'coll_traceability',
        },
        {
          name: EquipmentModel.name,
          schema: EquipmentSchema,
          collection: 'COLPRTEquipment',
        },
        {
          name: TechnologyModel.name,
          schema: TechnologySchema,
          collection: 'COLPRTTechnology',
        },
        {
          name: PospagoModel.name,
          schema: PospagoSchema,
          collection: 'COLPRTPostpaid',
        },
        {
          name: PrepagoModel.name,
          schema: PrepagoSchema,
          collection: 'COLPRTPrepaid',
        },
        { name: HomeModel.name, schema: HomeSchema, collection: 'COLPRTHomes' },
        {
          name: ParentsChildsModel.name,
          schema: ParentsChildsSchmea,
          collection: 'COLPRTCLASIFPARENTS',
        },
        {
          name: ParentsTemporaryModel.name,
          schema: ParentsTemporarySchema,
          collection: 'COLPRTPARENTS',
        }
      ],
      databaseConfig.dbFeatures,
    ),
  ],
  providers: [
    { provide: IMessageProvider, useClass: MessageProvider },
    { provide: IParamProvider, useClass: ParamProvider },
    { provide: IServiceErrorProvider, useClass: ServiceErrorProvider },
    { provide: IServiceTracingProvider, useClass: ServiceTracingProvider },
    { provide: ICategoriesProvider, useClass: CategoriesProviderImpl },
    { provide: IParentsProvider, useClass: ParentsProviderImpl },
    { provide: IServiceErrorUc, useClass: ServiceErrorUcimpl },
  ],
  exports: [
    IMessageProvider,
    IParamProvider,
    IServiceErrorProvider,
    IServiceTracingProvider,
    ICategoriesProvider,
    IParentsProvider,
    IServiceErrorUc,
  ],
})
export class DataProviderModule {}
