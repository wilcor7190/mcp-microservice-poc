/**
 * Intercepta todas la solicitudes http que llegen al servicio para formatear la respuesta
 * @author Fredy Santiago Martinez
 */

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';
import General from 'src/common/utils/generalUtil';
import { ResponseService } from '../dto/response-service.dto';
import { IServiceTracingUc } from 'src/core/use-case/resource/service-tracing.resource.uc';
import * as APM from '@claro/general-utils-library';
import { isEmptyObject } from '@claro/general-utils-library';
import databaseConfig from 'src/common/configuration/database.config';
import { MappingApiRest } from 'src/common/configuration/mapping-api-rest';


@Injectable()
export class RequestHttpInterceptor implements NestInterceptor<ResponseService> {

  constructor(public readonly _serviceTracing: IServiceTracingUc) { }
  
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseService> {
    const req = context.switchToHttp().getRequest();
    const resp = context.switchToHttp().getResponse();
    const time = Date.now();
    const db = databaseConfig.database;

    let spanDb = APM.startSpan(db.slice(0,7)+" "+/([DB])\w+/.exec(db)[0], MappingApiRest.DB, 'mongo', 'query');

    const request = (isEmptyObject(req.body)) ? req.body : req.query;
    General.logRequestResponse(req, request, RequestHttpInterceptor.name);
    const traceabilityStart =  General.traceabilityInterceptor(req, request);
    this._serviceTracing.createServiceTracing(traceabilityStart.getTraceability());

    if(spanDb) spanDb.end();

    return next.handle()
      .pipe(
        map(data => 
          ({
            ...data,
          }) 
        ),
        tap((data) => {
          const executionTime = Date.now() - time;  
          const traceabilityEnd =  General.traceabilityInterceptor(req, request, data, executionTime);
          this._serviceTracing.createServiceTracing(traceabilityEnd.getTraceability());
          General.logRequestResponse(req, request, RequestHttpInterceptor.name, data, executionTime);
          resp.status(200);
        })
      )
  }

}
