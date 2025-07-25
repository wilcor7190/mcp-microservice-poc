/**
 * Obtiene la configuracion y construción principal de la capa de negocio
 * @author alexisterzer
 */
import { Module } from '@nestjs/common';
import { DataProviderModule } from 'src/data-provider/data-provider.module';
import { ITransformFeatureUc } from './use-case/features/transform-feature.uc.';
import { IGetDataFeaturesUc } from './use-case/features/get-data-features.uc';
import { FeaturesUC } from './use-case/features/impl/orch-feature.uc.impl';
import { MessageUcimpl } from './use-case/resource/impl/message.uc.impl';
import { GetDataPricesUc } from './use-case/prices/impl/get-data-prices.uc.impl';
import { PricesUc } from './use-case/prices/impl/orch-prices.uc.impl';
import { HomesPricesAttributesUc } from './use-case/home/impl/orch-homes-prices-attributes.uc.impl';
import { TransformPricesUc } from './use-case/prices/impl/transform-prices.uc.impl';
import { IMessageUc } from './use-case/resource/message.uc';
import { IFeaturesUC } from './use-case/features/orch-features.uc';
import { IHomesPricesAttributesUc } from './use-case/home/orch-homes-prices-attributes.uc';
import { IPricesUc } from './use-case/prices/orch-prices.uc';
import { IGetDataPricesUc } from './use-case/prices/get-data-prices.uc';
import { ITransformPricesUc } from './use-case/prices/transform-prices.uc';
import { ServiceErrorUcimpl } from './use-case/resource/impl/service-error.resource.uc.impl';
import { ServiceTracingUcimpl } from './use-case/resource/impl/service-tracing.resource.uc.impl';
import { IServiceErrorUc } from './use-case/resource/service-error.resource.uc';
import { IServiceTracingUc } from './use-case/resource/service-tracing.resource.uc';
import { IGetErrorTracingUc } from './use-case/resource/get-error-tracing.resource.uc';
import { GetErrorTracingUcimpl } from './use-case/resource/impl/get-error-tracing.resource.uc.impl';
import { IMobilePricesAttributesUc } from './use-case/mobile/orch-mobile-prices-attributes.uc';
import { MobilePricesAttributesUc } from './use-case/mobile/impl/orch-mobile-prices-attributes.uc.impl';
import { IMappingMovilOrchUC } from './use-case/mobile/mapping-movil-orch.uc';
import { ItransformMovilFeatures } from './use-case/mobile/transform-movil-features.uc';
import { ItransformMovilPrices } from './use-case/mobile/transform-movil-prices.uc';
import { MappingMovilOrchUCImpl } from './use-case/mobile/impl/mapping-movil-orch.uc.impl';
import { TransformMovilFeatures } from './use-case/mobile/impl/transform-movil-features.uc.impl';
import { TransformMovilPricesImpl } from './use-case/mobile/impl/transform-movil-prices.uc.impl';
import { TransformFeatureImplUC } from './use-case/features/impl/transform-feature.uc.impl';
import { GetDataFeaturesUc } from './use-case/features/impl/get-data-features.uc.impl';

import generalConfig from 'src/common/configuration/general.config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ICatalogUc } from './use-case/catalog/catalog.uc';
import { CatalogUcImpl } from './use-case/catalog/impl/catalog.uc.impl';
import { IPricesProductOfferingUC } from './use-case/prices/product-offering-prices.uc';
import { PricesProductOfferingUC } from './use-case/prices/impl/product-offering-prices.uc.impl';
import{ CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register(),DataProviderModule],
  providers: [
    {provide: IFeaturesUC, useClass : FeaturesUC},
    {provide: IPricesUc, useClass : PricesUc},
    { provide: IPricesProductOfferingUC, useClass: PricesProductOfferingUC },
    { provide: ITransformPricesUc, useClass: TransformPricesUc },
    { provide: IMessageUc, useClass: MessageUcimpl },
    { provide: ITransformFeatureUc, useClass: TransformFeatureImplUC },
    { provide: IGetDataPricesUc, useClass: GetDataPricesUc },
    { provide: IGetDataFeaturesUc, useClass: GetDataFeaturesUc },
    { provide: IServiceErrorUc, useClass: ServiceErrorUcimpl },
    { provide: IServiceTracingUc, useClass:ServiceTracingUcimpl},
    { provide: IMappingMovilOrchUC, useClass: MappingMovilOrchUCImpl},
    { provide: ItransformMovilFeatures, useClass: TransformMovilFeatures},
    { provide: ItransformMovilPrices, useClass: TransformMovilPricesImpl},
    { provide: IServiceTracingUc, useClass:ServiceTracingUcimpl},
    { provide: IServiceErrorUc, useClass: ServiceErrorUcimpl},
    { provide: IHomesPricesAttributesUc, useClass: HomesPricesAttributesUc},
    { provide: IMobilePricesAttributesUc, useClass: MobilePricesAttributesUc},
    { provide: ICatalogUc, useClass: CatalogUcImpl},
    { provide: IGetErrorTracingUc, useClass:GetErrorTracingUcimpl},
  ],

  exports: [
    ITransformPricesUc,
    IMessageUc,
    IServiceErrorUc,
    IGetDataPricesUc,
    IGetDataFeaturesUc,
    IServiceTracingUc,
    IMappingMovilOrchUC,
    ItransformMovilFeatures,
    ItransformMovilPrices,
    IFeaturesUC,
    IPricesUc,
    IHomesPricesAttributesUc,
    IMobilePricesAttributesUc,
    ITransformFeatureUc,
    IGetErrorTracingUc
  ],
  
})
export class CoreModule { }
