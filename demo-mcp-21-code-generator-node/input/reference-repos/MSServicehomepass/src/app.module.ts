/**
 * Archivo para la construcción de todos los modulos y provedores del ms
 * @author Oscar Alvarez
 */
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { CommonModule } from './common/common.module';
import { ControllerModule } from './controller/controller.module';
import { CoreModule } from './core/core.module';
import { DataProviderModule } from './data-provider/data-provider.module';
import { ExceptionManager } from './common/lib/exceptions-manager.filter';
import { Module } from '@nestjs/common';
import { RequestHttpInterceptor } from './controller/interceptor/request-http.interceptor';
import { ScheduleModule } from '@nestjs/schedule';
import { ApmInterceptor } from './controller/interceptor/apm.interceptor';

@Module({
  imports: [ScheduleModule.forRoot(), CommonModule, DataProviderModule, CoreModule, ControllerModule, CacheModule.register()],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionManager,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ApmInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestHttpInterceptor,
    }
  ],
})
export class AppModule {}
