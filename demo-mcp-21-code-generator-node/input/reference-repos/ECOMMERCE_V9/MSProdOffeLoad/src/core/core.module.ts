/**
 * Obtiene la configuracion y construción principal de la capa de negocio
 * @author Santiago Vargas
 */

import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { DataProviderModule } from '../data-provider/data-provider.module';
import { IOrchDataloadUC } from './use-case/orch-dataload.uc';
import { OrchDataloadUC } from './use-case/impl/orch-dataload.uc.impl';
import { IProductDataUC } from './use-case/product-data/product-data.uc';
import { ProductDataUC } from './use-case/product-data/impl/product-data.uc.impl';
import { ISalesCatalogUC } from './use-case/product-data/sales-catalog.uc';
import { SalesCatalogUC } from './use-case/product-data/impl/sales-catalog.uc.impl';
import { IAttributesProductsUC } from './use-case/attributes-products/attributes-products.uc';
import { AttributesProductsUC } from './use-case/attributes-products/impl/attributes-products.uc.impl';
import { IAttributesDictionaryUC } from './use-case/attributes-dictionary/attributes-dictionary.uc';
import { AttributesDictionaryUC } from './use-case/attributes-dictionary/impl/attributes-dictionary.uc.impl';
import { IAttachmentsDataUC } from './use-case/attachments-data/attachments-data.uc';
import { AttachmentsDataUC } from './use-case/attachments-data/impl/attachments-data.uc.impl';
import { IProductInventoryUC } from './use-case/product-inventory/product-inventory.uc';
import { ProductInventoryUC } from './use-case/product-inventory/impl/product-inventory.uc.impl';
import { IPriceListUC } from './use-case/price-list/price-list.uc';
import { PriceListUC } from './use-case/price-list/impl/price-list.uc.impl';
import { IServiceErrorUc } from './use-case/resource/service-error.resource.uc';
import { ServiceErrorUcimpl } from './use-case/resource/impl/service-error.resource.uc.impl';
import { IServiceTracingUc } from './use-case/resource/service-tracing.resource.uc';
import { IMessageUc } from './use-case/message.uc';
import { IParamUc } from './use-case/resource/param.resource.uc';
import { MessageUcimpl } from './use-case/impl/message.uc.impl';
import { ParamUcimpl } from './use-case/resource/impl/param.resource.uc.impl';
import { ISelectDataloadUC } from './use-case/select-dataload.uc';
import { SelectDataloadUC } from './use-case/impl/select-dataload.uc.impl';
import { ServiceTracingUcimpl } from './use-case/resource/impl/service-tracing.resource.uc.impl';
import { DataloadUCImpl } from './use-case/impl/dataload.uc.impl';
import { IDataloadUC } from './use-case/dataload.uc';

@Module({
  imports: [CacheModule.register(),DataProviderModule],
  providers: [
    { provide: IOrchDataloadUC, useClass: OrchDataloadUC },
    { provide: IProductDataUC, useClass: ProductDataUC },
    { provide: ISalesCatalogUC, useClass: SalesCatalogUC },
    { provide: IAttributesProductsUC, useClass: AttributesProductsUC },
    { provide: IAttributesDictionaryUC, useClass: AttributesDictionaryUC },
    { provide: IAttachmentsDataUC, useClass: AttachmentsDataUC },
    { provide: IProductInventoryUC, useClass: ProductInventoryUC },
    { provide: IPriceListUC, useClass: PriceListUC },
    { provide: IServiceErrorUc, useClass: ServiceErrorUcimpl },
    { provide: IServiceTracingUc, useClass: ServiceTracingUcimpl },
    { provide: IMessageUc, useClass: MessageUcimpl },
    { provide: IParamUc, useClass: ParamUcimpl },
    { provide: ISelectDataloadUC, useClass: SelectDataloadUC },
    { provide: IDataloadUC, useClass: DataloadUCImpl }
  ],
  
  exports: [
    IOrchDataloadUC,
    IProductDataUC,
    ISalesCatalogUC,
    IAttributesProductsUC,
    IAttributesDictionaryUC,
    IAttachmentsDataUC,
    IProductInventoryUC,
    IPriceListUC,
    IServiceErrorUc,
    IServiceTracingUc,
    IMessageUc,
    IParamUc,
    ISelectDataloadUC,
    IDataloadUC
  ]
})
export class CoreModule {}
