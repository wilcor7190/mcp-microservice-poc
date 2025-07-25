import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import databaseConfig from '../common/configuration/database.config';
import { IMessageProvider } from './message.provider';
import { IParamProvider } from './param.provider';
import { MessageProvider } from './provider/message.provider.impl';
import { ParamProvider } from './provider/param.provider.impl';
import { ServiceErrorProvider } from './provider/service-error.provider.impl';
import { ServiceTracingProvider } from './provider/service-tracing.provider.impl';
import { IServiceErrorProvider } from './service-error.provider';
import { IServiceTracingProvider } from './service-tracing.provider';
import { PricesProvider } from './provider/prices.provider.impl';
import { IPricesProvider } from './prices.provider';
import {
  GeneralLastPrices,
  GeneralSchemaLastPrices,
} from './model/last-prices.model';
import { EquipmentModel, EquipmentSchema } from './model/equipment.model';
import {
  ProductOfferingModel,
  ProductOfferingSchema,
} from './model/product-offering/product-offering.model';
import { IProductOfferingProvider } from './product-offering.provider';
import { ProductOfferingProvider } from './provider/product-offering.provider.impl';
import { IEquipmentProvider } from './equipment.provider';
import { EquipmentProvider } from './provider/equipment.provider.impl';
import { TechnologyModel, TechnologySchema } from './model/technology.model';
import { ITechnologyProvider } from './technology.provider';
import { TechnologyProvider } from './provider/technology.provider.impl';
import { MessageModel, MessageSchema, ParamModel, ParamSchema, ServiceErrorModel, ServiceErrorSchema, ServiceTracingModel, ServiceTracingSchema } from '@claro/generic-models-library';

@Module({
  imports: [
    //Conexión a las base de datos de prices y product offering
    MongooseModule.forRoot(databaseConfig.database, {
      retryAttempts: 3,
      autoCreate: true,
      connectionName: databaseConfig.database,
    }),
    MongooseModule.forRoot(databaseConfig.databaseProductOffering, {
      retryAttempts: 3,
      autoCreate: true,
      connectionName: databaseConfig.databaseProductOffering,
    }),
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
          name: GeneralLastPrices.name,
          schema: GeneralSchemaLastPrices,
          collection: 'COLLastPricesTT',
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
      ],
      databaseConfig.database,
    ),
    MongooseModule.forFeature(
      [
        {
          name: ProductOfferingModel.name,
          schema: ProductOfferingSchema,
          collection: 'COLPRTPRODUCTOFFERING',
        },
      ],
      databaseConfig.databaseProductOffering,
    ),
  ],
  providers: [
    { provide: IMessageProvider, useClass: MessageProvider },
    { provide: IParamProvider, useClass: ParamProvider },
    { provide: IServiceErrorProvider, useClass: ServiceErrorProvider },
    { provide: IServiceTracingProvider, useClass: ServiceTracingProvider },
    { provide: IPricesProvider, useClass: PricesProvider },
    { provide: IProductOfferingProvider, useClass: ProductOfferingProvider },
    { provide: IEquipmentProvider, useClass: EquipmentProvider },
    { provide: ITechnologyProvider, useClass: TechnologyProvider },
  ],
  exports: [
    IMessageProvider,
    IParamProvider,
    IServiceErrorProvider,
    IServiceTracingProvider,
    IPricesProvider,
    IProductOfferingProvider,
    IEquipmentProvider,
    ITechnologyProvider,
  ],
})
export class DataProviderModule {}
