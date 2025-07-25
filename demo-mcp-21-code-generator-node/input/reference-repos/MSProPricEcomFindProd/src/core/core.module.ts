import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { DataProviderModule } from 'src/data-provider/data-provider.module';
import { MessageUcimpl } from './use-case/impl/message.uc.impl';
import { IMessageUc } from './use-case/message.uc';
import { ParamUcimpl } from './use-case/resource/impl/param.resource.uc.impl';
import { ServiceErrorUcimpl } from './use-case/resource/impl/service-error.resource.uc.impl';
import { ServiceTracingUcimpl } from './use-case/resource/impl/service-tracing.resource.uc.impl';
import { IParamUc } from './use-case/resource/param.resource.uc';
import { IServiceErrorUc } from './use-case/resource/service-error.resource.uc';
import { IServiceTracingUc } from './use-case/resource/service-tracing.resource.uc';
import { ISKUSondUc } from './use-case/sku-sond.uc';
import { SKUSondUcimpl } from './use-case/impl/sku-sond.uc.impl';

@Module({
  imports: [CacheModule.register(), DataProviderModule],
  providers: [
    { provide: IMessageUc, useClass: MessageUcimpl },
    { provide: IParamUc, useClass: ParamUcimpl },
    { provide: IServiceErrorUc, useClass: ServiceErrorUcimpl },
    { provide: IServiceTracingUc, useClass: ServiceTracingUcimpl },
    { provide: ISKUSondUc, useClass: SKUSondUcimpl },
  ],

  exports: [IMessageUc, IParamUc, IServiceErrorUc, IServiceTracingUc, ISKUSondUc],
})
export class CoreModule { }
