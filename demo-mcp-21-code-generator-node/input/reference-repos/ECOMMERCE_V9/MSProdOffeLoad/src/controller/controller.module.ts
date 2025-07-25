/**
 * Obtiene la configuracion y construción principal de los controladores
 * @author Fredy Santiago Martinez
 */

import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { TerminusModule } from '@nestjs/terminus';
import { DataProviderModule } from '../data-provider/data-provider.module';
import { IDataloadService } from './service/dataload.service';
import { DataloadService } from './service/impl/dataload.service.impl';
import { DataloadController } from './dataload.controller';
import { EventsController } from './events.controller';
import { IEventsService } from './service/events.service';
import { EventsService } from './service/impl/events.service.impl';

@Module({
  imports: [CoreModule, TerminusModule, DataProviderModule],
  controllers: [DataloadController, EventsController],
  providers: [
    { provide: IDataloadService, useClass: DataloadService },
    { provide: IEventsService, useClass: EventsService }
  ],
})
export class ControllerModule {}
