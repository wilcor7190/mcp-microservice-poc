/**
 * Intercepta todas la solicitudes http que llegen al servicio para formatear la respuesta
 * @author alexisterzer
 */

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import * as moment from 'moment';
import { map, Observable, tap } from 'rxjs';
import GeneralUtil from 'src/common/utils/GeneralUtil';
import { ResponseService } from '../dto/response-service.dto';
import { IServiceTracingUc } from 'src/core/use-case/resource/service-tracing.resource.uc';
import * as APM from '@claro/general-utils-library';
import databaseConfig from 'src/common/configuration/database.config';
import { MappingApiRest } from 'src/common/utils/enums/tracing.enum';


@Injectable()
export class RequestHttpInterceptor implements NestInterceptor<ResponseService> {

  constructor(public readonly _serviceTracing: IServiceTracingUc) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseService> {

    const now = moment();
    const requestTime = moment().format();
    const req = context.switchToHttp().getRequest();
    const resp = context.switchToHttp().getResponse();
    const time = Date.now();
    const db = databaseConfig.database;

    let spanDb = APM.startSpan(db.slice(0,7)+" "+/([DB])\w+/.exec(db)[0], MappingApiRest.DB, 'mongo', 'query');
    const request = (GeneralUtil.isEmptyObject(req.body)) ? req.body : req.query;

    GeneralUtil.logRequestResponse(req, request, RequestHttpInterceptor.name);
    const traceabilityStart =  GeneralUtil.traceabilityInterceptor(req, request);
    this._serviceTracing.createServiceTracing(traceabilityStart.getTraceability());

    if(spanDb) spanDb.end();

    return next.handle()
      .pipe(
        map(data => (
          {
            ...data,
            requestTime,
            responseTime: moment().diff(now),
            method: req.method,
            origen: GeneralUtil.getOrigin(context.getArgs()[0]['url']),
            status: data?.status || resp?.statusCode
          }
        )),
        tap((data) => {
          const executionTime = Date.now() - time;  
          const traceabilityEnd =  GeneralUtil.traceabilityInterceptor(req, request, data, executionTime);
          this._serviceTracing.createServiceTracing(traceabilityEnd.getTraceability());
          GeneralUtil.logRequestResponse(req, request, RequestHttpInterceptor.name, data, executionTime);
          resp.status(data.status);        })
      );
  }

}

