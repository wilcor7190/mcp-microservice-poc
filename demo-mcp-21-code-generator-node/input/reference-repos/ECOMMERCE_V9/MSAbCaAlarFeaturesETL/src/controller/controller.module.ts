import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { CategoriesController } from './categories.controller';
import { ICategoriesService } from './service/categories.service';
import { CategoriesService } from './service/impl/categories.service.impl';
import { CategoriesJob } from './jobs/categories.job';
import { ScheduleModule } from '@nestjs/schedule';
import { CoreModule } from '../core/core.module';
import { DataProviderModule } from '../data-provider/data-provider.module';

/**
 * Obtiene la configuracion y construción principal de los controladores
 * @author Santiago Vargas
 */
@Module({
  imports: [
    CoreModule, 
    TerminusModule, 
    DataProviderModule,
    ScheduleModule.forRoot()
  ],
  controllers: [CategoriesController],
  providers: [
    CategoriesJob,
    { provide: ICategoriesService, useClass: CategoriesService }
  ],
})
export class ControllerModule {}
