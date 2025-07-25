/**
 * Obtiene la configuracion y construción principal de los controladores
 * @author alexisterzer
 */

import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TerminusModule } from '@nestjs/terminus';
import { CoreModule } from 'src/core/core.module';
import { DataProviderModule } from 'src/data-provider/data-provider.module';
import { ContingencyController } from './contingency.controller';
import { ContingencyJob } from './jobs/contingency.job';
import { IContingencyService } from './service/contingency.service';
import { ContingencyService } from './service/impl/contingency.service.impl';
import { MessageService } from './service/impl/message.service.impl';
import { IMessageService } from './service/message.service';
     


@Module({
  imports: [
    CoreModule, 
    TerminusModule, 
    DataProviderModule,
    ScheduleModule.forRoot()],
  controllers: [  ContingencyController],
  providers: [
    ContingencyJob,
    { provide: IMessageService, useClass: MessageService },   
    { provide: IContingencyService, useClass: ContingencyService },
  ],
})
export class ControllerModule {}
