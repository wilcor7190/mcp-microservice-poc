import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { CoreModule } from 'src/core/core.module';
import { DataProviderModule } from 'src/data-provider/data-provider.module';
import { IGlobalValidateIService } from './service/globalValidate.service';
import { GlobalValidateIService } from './service/impl/globalValidate.service.impl';
import { MessageService } from './service/impl/message.service.impl';
import { IMessageService } from './service/message.service';
import { ISkuSondService } from './service/sku-sond.service';
import { SKUSondController } from './sku-sond.controller';
import { SkuSondServiceImpl } from './service/impl/sku-sond.service.impl';


@Module({
  imports: [CoreModule, TerminusModule, DataProviderModule],
  controllers: [SKUSondController],
  providers: [
    { provide: IMessageService, useClass: MessageService },
    { provide: IGlobalValidateIService, useClass: GlobalValidateIService },
	  { provide: ISkuSondService, useClass: SkuSondServiceImpl },
  ]
})
export class ControllerModule { }
