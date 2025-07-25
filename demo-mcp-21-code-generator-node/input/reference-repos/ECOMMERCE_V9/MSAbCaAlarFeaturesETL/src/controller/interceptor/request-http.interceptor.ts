import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import * as moment from 'moment';
import { map, Observable } from 'rxjs';
import General from '../../common/utils/GeneralUtil';
import { ResponseService } from '../dto/response-service.dto';

/**
 * Intercepta todas la solicitudes http que llegen al servicio para formatear la respuesta
 * @author Frank Morales
 */

@Injectable()
export class RequestHttpInterceptor implements NestInterceptor<ResponseService> {

  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseService> {

    const now = moment();
    const requestTime = moment().format();
    const req = context.switchToHttp().getRequest();
    const resp = context.switchToHttp().getResponse();


    return next.handle()
      .pipe(
        map(data => (
          {
            ...data,
            requestTime,
            responseTime: moment().diff(now),
            method: req.method,
            origen: General.getOrigin(context.getArgs()[0]['url']),
            status: data?.status || resp?.statusCode
          }
        ))
      );
  }

}
