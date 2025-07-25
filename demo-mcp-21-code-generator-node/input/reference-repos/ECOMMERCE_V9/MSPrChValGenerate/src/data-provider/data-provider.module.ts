/**
 * Obtiene la configuraciones a bases de datos, colleciones y construción principal 
 * de la capa que interactua con los proveedores exteriores
 * @author alexiserzer
 */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceErrorUcimpl } from 'src/core/use-case/resource/impl/service-error.resource.uc.impl';
import { ServiceTracingUcimpl } from 'src/core/use-case/resource/impl/service-tracing.resource.uc.impl';
import { IServiceErrorUc } from 'src/core/use-case/resource/service-error.resource.uc';
import { IServiceTracingUc } from 'src/core/use-case/resource/service-tracing.resource.uc';
import databaseConfig from '../common/configuration/database.config';
import { IFeatureProvider } from './provider/feature/transform-feature.provider';
import { IFileManagerProvider } from './provider/downloadFile/file-manager.provider';
import { IHttpProvider } from './http.provider';
import { IMessageProvider } from './message.provider';
import { GeneralModel, GeneralSchema } from './model/general/general.model';
import { IMovilFeaturesProvider } from './provider/mobile/movil-features.provider';
import { IParamProvider } from './param.provider';
import { FileManagerProvider } from './provider/downloadFile/impl/file-manager.provider.impl';
import { HttpProvider } from './provider/http.provider.impl';
import { MessageProvider } from './provider/message.provider.impl';
import { ParamProvider } from './provider/param.provider.impl';
import { ServiceErrorProvider } from './provider/service-error.provider.impl';
import { ServiceTracingProvider } from './provider/service-tracing.provider.impl';
import { SftpManagerProvider } from "./provider/downloadFile/impl/sftp-manager.provider.impl";
import { IServiceErrorProvider } from './service-error.provider';
import { IServiceTracingProvider } from './service-tracing.provider';
import { ISftpManagerProvider } from "./provider/downloadFile/sftp-manager.provider";
import { IHomePricesAttributesProvider } from './provider/home/homesPricesAttributes.provider';
import { HomePricesAttributesProvider } from './provider/home/impl/homesPricesAttributes.provider.impl';
import { MobilePricesAttributesProvider } from './provider/mobile/impl/mobile-prices-attributes.provider.impl';
import { IPriceProvider } from './provider/prices/price.provider';
import { PriceProvider } from './provider/prices/impl/price.provider.impl';
import { MovilFeaturesProvider } from './provider/mobile/impl/movil-features.provider.impl';
import { ICollectionMongoDBProvider } from './collectionMongoDB.provider';
import { CollectionMongoDBProvider } from './provider/collectionMongoDB.provider.impl';
import { FeatureProvider } from './provider/feature/impl/transform-feature.provider.impl';
import { IGetErrorTracingUc } from '../core/use-case/resource/get-error-tracing.resource.uc';
import { GetErrorTracingUcimpl } from '../core/use-case/resource/impl/get-error-tracing.resource.uc.impl';
import { ProductAttributesModel, ProductAttributesSchema } from './model/catalog/product-attributes/product-attributes.model';
import { ICatalogProvider } from './provider/catalog/catalog.provider';
import { CatalogProvider } from './provider/catalog/impl/catalog.provider.impl';
import { ExceptionModel, ExceptionSchema } from './model/catalog/exception.model';
import { TermsModel, TermSchema } from './model/catalog/terms.model';
import { IMobilePricesAttributesProvider } from './provider/mobile/mobile-prices-attributes.provider';

import { MessageModel, MessageSchema, ParamModel, ParamSchema, ServiceErrorModel, ServiceErrorSchema, ServiceTracingModel, ServiceTracingSchema } from '@claro/generic-models-library';

@Module({
  imports: [
    //Conexión a base de datos
    MongooseModule.forRoot(databaseConfig.database, {
      retryAttempts: 3,
      autoCreate: true,
      connectionName: databaseConfig.database
    }),
    //Conexión a base de datos
    MongooseModule.forRoot(databaseConfig.databaseCatalog, {
      retryAttempts: 3,
      autoCreate: false,
      connectionName: databaseConfig.databaseCatalog
    }),  

    MongooseModule.forFeature([
      { name: GeneralModel.name, schema: GeneralSchema, collection: 'COLPRTPRODUCTOFFERING'},
      { name: MessageModel.name, schema: MessageSchema, collection: 'coll_message'},
      { name: ParamModel.name, schema: ParamSchema, collection: 'coll_params' },
      { name: ServiceErrorModel.name, schema: ServiceErrorSchema, collection: 'coll_service_error' },
      { name: ServiceTracingModel.name, schema: ServiceTracingSchema, collection: 'coll_traceability' },
    ],databaseConfig.database),

    MongooseModule.forFeature([
      { name: ProductAttributesModel.name, schema: ProductAttributesSchema, collection: 'COLPRTTTATTRIBUTES'},
      { name: TermsModel.name, schema: TermSchema, collection: 'COLPRTTERMS'},
      { name: ExceptionModel.name, schema: ExceptionSchema, collection: 'COLPRTEXCEPTIONS'},
    ],databaseConfig.databaseCatalog)
  ], 
  providers: [
    { provide: IFeatureProvider, useClass: FeatureProvider },
    { provide: ICatalogProvider, useClass: CatalogProvider },
    { provide: IPriceProvider, useClass: PriceProvider },
    { provide: IHomePricesAttributesProvider, useClass: HomePricesAttributesProvider },
    { provide: IMobilePricesAttributesProvider, useClass: MobilePricesAttributesProvider },
    { provide: IMessageProvider, useClass: MessageProvider },
    { provide: IFileManagerProvider, useClass: FileManagerProvider },
    { provide: IHttpProvider, useClass: HttpProvider },
    { provide: IParamProvider, useClass: ParamProvider },
    { provide: ISftpManagerProvider, useClass: SftpManagerProvider },
    { provide: IServiceErrorProvider, useClass: ServiceErrorProvider },
    { provide: IServiceTracingProvider, useClass: ServiceTracingProvider },
    { provide: IMovilFeaturesProvider, useClass: MovilFeaturesProvider},
    { provide: IServiceTracingUc, useClass: ServiceTracingUcimpl },
    { provide: IServiceErrorUc, useClass: ServiceErrorUcimpl },
    { provide: ICollectionMongoDBProvider, useClass: CollectionMongoDBProvider },
    { provide: IGetErrorTracingUc, useClass:GetErrorTracingUcimpl}
  ],
  exports: [
    IMessageProvider,
    IParamProvider,
    ISftpManagerProvider,
    ICatalogProvider,
    IServiceErrorProvider,
    IFileManagerProvider,
    IPriceProvider,
    IFeatureProvider,
    IServiceTracingProvider,
    IMovilFeaturesProvider,
    IServiceTracingUc,
    IServiceErrorUc,
    IHomePricesAttributesProvider,
    IMobilePricesAttributesProvider,
    ICollectionMongoDBProvider,
    IGetErrorTracingUc
  ],
})
export class DataProviderModule { }