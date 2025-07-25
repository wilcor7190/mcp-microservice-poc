import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import * as moment from 'moment';
import { map, Observable, tap } from 'rxjs';
import { ResponseService } from '../dto/response-service.dto';
import GeneralUtil from 'src/common/utils/generalUtil';
import { IServiceTracingUc } from 'src/core/use-case/resource/service-tracing.resource.uc';
import { MappingApiRest } from '../../common/utils/enums/mapping-api-rest';
import databaseConfig from '../../common/configuration/database.config';
import * as APM from '@claro/general-utils-library';
/**
 * Intercepta todas la solicitudes http que llegen al servicio para formatear la respuesta
 */
@Injectable()
export class RequestHttpInterceptor implements NestInterceptor<ResponseService> {
  constructor(public readonly _serviceTracing: IServiceTracingUc) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseService> {
    const now = moment();
    const requestTime = moment().format();
    const req = context.switchToHttp().getRequest();
    const resp = context.switchToHttp().getResponse();
    const time = Date.now();
    const request = GeneralUtil.isEmptyObject(req.body) ? req.body : req.query;
    const db = databaseConfig.database;
    let spanDb = APM.startSpan(db.slice(0,7)+" "+/([DB])\w+/.exec(db)[0], MappingApiRest.DB, 'mongo', 'query');
    
    GeneralUtil.logRequestResponse(req, request, RequestHttpInterceptor.name);
    if(spanDb) spanDb.end();
    const traceabilityStart = GeneralUtil.traceabilityInterceptor(req, request);
    this._serviceTracing.createServiceTracing(traceabilityStart.getTraceability());
    

    return next.handle().pipe(
      map((data) => ({
        ...data,
        requestTime,
        responseTime: moment().diff(now),
        method: req.method,
        origen: GeneralUtil.getOrigin(context.getArgs()[0]['url']),
        status: data?.status || resp?.statusCode,
      })),
      tap((data) => {
        const executionTime = Date.now() - time;
        const traceabilityEnd = GeneralUtil.traceabilityInterceptor(req, request, data, executionTime);
        this._serviceTracing.createServiceTracing(traceabilityEnd.getTraceability());
        GeneralUtil.logRequestResponse(req, request, RequestHttpInterceptor.name, data, executionTime);
        resp.status(data.status);
      }),
    );
  }
}
