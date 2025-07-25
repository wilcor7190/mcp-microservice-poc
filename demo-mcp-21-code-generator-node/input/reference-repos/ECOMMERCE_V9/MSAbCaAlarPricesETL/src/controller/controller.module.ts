import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { CoreModule } from '../core/core.module';
import { DataProviderModule } from '../data-provider/data-provider.module';
import { PriceController } from './prices.controller';
import { IPricesService } from './service/prices.service';
import { ScheduleModule } from '@nestjs/schedule';
import { PriceJob } from './jobs/price.job';
import { PricesServiceImpl } from './service/impl/prices.services.impl';

@Module({
  imports: [CoreModule, TerminusModule, DataProviderModule, ScheduleModule.forRoot()],
  controllers: [PriceController],
  providers: [
    PriceJob,
    { provide: IPricesService, useClass:PricesServiceImpl}
  ],
})
export class ControllerModule {}
