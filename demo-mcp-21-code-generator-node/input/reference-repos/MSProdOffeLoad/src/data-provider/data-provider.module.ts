/**
 * Obtiene la configuraciones a bases de datos, colleciones y construción principal
 * de la capa que interactua con los proveedores exteriores
 * @author Santiago Vargas
 */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { 
  MessageModel, 
  MessageSchema, 
  ParamModel, 
  ParamSchema, 
  ServiceErrorModel, 
  ServiceErrorSchema, 
  ServiceTracingModel, 
  ServiceTracingSchema 
} from '@claro/generic-models-library';

import databaseConfig from '../common/configuration/database.config';
import {
  EquipmentModel,
  EquipmentSchema,
} from './model/dataload/equipment.model';
import { DataloadProviderImpl } from './provider/dataload.provider.impl';
import { IDataloadProvider } from './dataload.provider';
import { ISftpProvider } from './sftp.provider';
import { SftpProvider } from './provider/sftp.provider.impl';
import {
  ParentsChildsModel,
  ParentsChildsSchmea,
} from './model/dataload/colprtclasifparents.model';
import {
  TechnologyModel,
  TechnologySchema,
} from './model/dataload/technology.model';
import {
  DisponibilityModel,
  DisponibilitySchema,
} from './model/dataload/disponibility.model';
import {
  PriceListEquModel,
  PriceListEquSchema,
} from './model/dataload/price-equ.model';
import {
  PriceListTecModel,
  PriceListTecSchema,
} from './model/dataload/price-tec.model';
import { IServiceErrorProvider } from './service-error.provider';
import { ServiceErrorProvider } from './provider/service-error.provider.impl';
import { IServiceTracingProvider } from './service-tracing.provider';
import { ServiceTracingProvider } from './provider/service-tracing.provider.impl';
import { IServiceErrorUc } from '../core/use-case/resource/service-error.resource.uc';
import { IMessageProvider } from './message.provider';
import { IParamProvider } from './param.provider';
import { ParamProvider } from './provider/param.provider.impl';
import { MessageProvider } from './provider/message.provider.impl';
import { PospagoModel, PospagoSchema } from './model/dataload/pospago.model';
import { PrepagoModel, PrepagoSchema } from './model/dataload/prepago.model';
import { HomesModel, HomesSchema } from './model/dataload/homes.model';
import {
  PriceListPosModel,
  PriceListPosSchema,
} from './model/dataload/price-pos.model';
import {
  PriceListPreModel,
  PriceListPreSchema,
} from './model/dataload/price-pre.model';
import {
  PriceListHomeModel,
  PriceListHomeSchema,
} from './model/dataload/price-home.model';
import { IDataloadProviderPrices } from './dataload-prices.provider';
import { DataloadProviderPricesImpl } from './provider/dataload-prices.provider.impl';
import { ServiceErrorUcimpl } from '../core/use-case/resource/impl/service-error.resource.uc.impl';
import { ServiceTracingUcimpl } from '../core/use-case/resource/impl/service-tracing.resource.uc.impl';
import { IServiceTracingUc } from '../core/use-case/resource/service-tracing.resource.uc';

@Module({
  imports: [
    //Conexión a base de datos
    MongooseModule.forRoot(databaseConfig.database, {
      retryAttempts: 3,
      autoCreate: false,
      connectionName: databaseConfig.database,
    }),
    MongooseModule.forRoot(databaseConfig.databaseFeatures, {
      retryAttempts: 3,
      autoCreate: false,
      connectionName: databaseConfig.databaseFeatures,
    }),
    MongooseModule.forRoot(databaseConfig.databaseDisponibility, {
      retryAttempts: 3,
      autoCreate: false,
      connectionName: databaseConfig.databaseDisponibility,
    }),
    MongooseModule.forRoot(databaseConfig.databasePrices, {
      retryAttempts: 3,
      autoCreate: false,
      connectionName: databaseConfig.databasePrices,
    }),

    MongooseModule.forFeature(
      [
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
          name: ParentsChildsModel.name,
          schema: ParentsChildsSchmea,
          collection: 'COLPRTCLASIFPARENTS',
        },
        {
          name: PospagoModel.name,
          schema: PospagoSchema,
          collection: 'COLPRTPospago',
        },
        {
          name: PrepagoModel.name,
          schema: PrepagoSchema,
          collection: 'COLPRTPrepago',
        },
        {
          name: HomesModel.name,
          schema: HomesSchema,
          collection: 'COLPRTHomes',
        },
      ],
      databaseConfig.databaseFeatures,
    ),

    MongooseModule.forFeature(
      [
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
          name: MessageModel.name,
          schema: MessageSchema,
          collection: 'coll_message',
        },
        {
          name: ParamModel.name,
          schema: ParamSchema,
          collection: 'coll_params',
        },
      ],
      databaseConfig.database,
    ),

    MongooseModule.forFeature(
      [
        {
          name: DisponibilityModel.name,
          schema: DisponibilitySchema,
          collection: 'COLPRTDisponibility',
        },
      ],
      databaseConfig.databaseDisponibility,
    ),

    MongooseModule.forFeature(
      [
        {
          name: PriceListEquModel.name,
          schema: PriceListEquSchema,
          collection: 'COLPRTEquipment',
        },
        {
          name: PriceListTecModel.name,
          schema: PriceListTecSchema,
          collection: 'COLPRTTechnology',
        },
        {
          name: PriceListPosModel.name,
          schema: PriceListPosSchema,
          collection: 'COLPRTPospago',
        },
        {
          name: PriceListPreModel.name,
          schema: PriceListPreSchema,
          collection: 'COLPRTPrepago',
        },
        {
          name: PriceListHomeModel.name,
          schema: PriceListHomeSchema,
          collection: 'COLPRTHomes',
        },
      ],
      databaseConfig.databasePrices,
    ),
    HttpModule,
  ],
  providers: [
    { provide: ISftpProvider, useClass: SftpProvider },
    { provide: IDataloadProvider, useClass: DataloadProviderImpl },
    { provide: IDataloadProviderPrices, useClass: DataloadProviderPricesImpl },
    { provide: IServiceErrorProvider, useClass: ServiceErrorProvider },
    { provide: IServiceTracingProvider, useClass: ServiceTracingProvider },
    { provide: IServiceErrorUc, useClass: ServiceErrorUcimpl },
    { provide: IMessageProvider, useClass: MessageProvider },
    { provide: IParamProvider, useClass: ParamProvider },
    { provide: IServiceTracingUc, useClass: ServiceTracingUcimpl },
    HttpModule,
  ],
  exports: [
    ISftpProvider,
    IDataloadProvider,
    IDataloadProviderPrices,
    IServiceErrorProvider,
    IServiceTracingProvider,
    IServiceErrorUc,
    IMessageProvider,
    IParamProvider,
    HttpModule,
  ],
})
export class DataProviderModule {}
