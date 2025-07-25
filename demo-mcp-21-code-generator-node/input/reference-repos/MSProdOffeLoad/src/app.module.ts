/**
 * Archivo para la construcción de todos los modulos y provedores del ms
 * @author Oscar Alvarez
 */

import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CommonModule } from './common/common.module';
import { ExceptionManager } from './common/lib/exceptions-manager.filter';
import { ControllerModule } from './controller/controller.module';
import { RequestHttpInterceptor } from './controller/interceptor/request-http.interceptor';
import { CoreModule } from './core/core.module';
import { DataProviderModule } from './data-provider/data-provider.module';
import { ApmInterceptor } from './controller/interceptor/apm.interceptor';

@Module({
  imports: [CommonModule, DataProviderModule, CoreModule, ControllerModule],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionManager,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestHttpInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ApmInterceptor,
    }
  ],
})
export class AppModule {}
