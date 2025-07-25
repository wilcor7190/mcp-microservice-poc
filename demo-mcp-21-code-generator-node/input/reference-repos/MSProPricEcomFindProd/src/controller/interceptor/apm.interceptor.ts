import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import * as APM from '@claro/general-utils-library';

/**
 *  @description Archivo inrterceptor.ts que permiten vincular lógica adicional antes / después
 *  de la ejecución de un metodo. Transformando el resultado devuelto por la función o metodo.
 *  @author Tatiana Quiroz
 *
 */
@Injectable()
export class ApmInterceptor implements NestInterceptor {

  intercept(
    context: ExecutionContext,
    next: CallHandler<Observable<any>>,
  ): Observable<any> {
    const [IncomingMessage] = context.getArgs();
    return next.handle().pipe(
      tap(() => {
        APM.startTransaction(
          `${IncomingMessage.method} ${IncomingMessage.url}`,
        );
      }),
      catchError((error) => {
        APM.captureError(error);
        throw error;
      }),
    );
  }
}
