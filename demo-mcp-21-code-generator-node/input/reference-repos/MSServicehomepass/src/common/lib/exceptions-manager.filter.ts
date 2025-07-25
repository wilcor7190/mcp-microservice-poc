/**
 * Clase que intercepta las excepciones en el servicio
 * @author Oscar Alvarez
 */

import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import * as moment from 'moment';
import { ResponseService } from '../../controller/dto/response-service.dto';
import { EmessageMapping } from '../utils/enums/message.enum';
import { BusinessException } from './business-exceptions';
import Logging from './logging';
import { IServiceTracingUc } from 'src/core/use-case/resource/service-tracing.resource.uc';
import { IServiceErrorUc } from 'src/core/use-case/resource/service-error.resource.uc';
import GeneralUtil from '../utils/generalUtil';
import Traceability  from './traceability';
import { EStatusTracingGeneral, ETaskTracingGeneral } from '../utils/enums/tracing.enum';
import { Etask } from '../utils/enums/task.enum';
import { ELevelsErrors } from '../utils/enums/logging.enum';
import { LegacyException } from './legacy-exeptions';
import { IServiceTracingInitial, ITaskError } from "@claro/generic-models-library";
@Catch()
export class ExceptionManager implements ExceptionFilter {
  private log: Logging = new Logging(ExceptionManager.name);

  constructor(
    public readonly _serviceTracing: IServiceTracingUc,
    public readonly _serviceError: IServiceErrorUc,
  ) {}

  async catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const req = ctx.getRequest();

    let result: ResponseService;

    const origen: string = GeneralUtil.getOrigin(req['url']);

    result = await this.validateException(exception);

    result = {
      ...result,
      requestTime: moment().format(),
      method: req.method,
      origen,
    };

    let request = GeneralUtil.isEmptyObject(req.body) ? req.body : req.query;
    let nivel = exception instanceof BusinessException || exception instanceof HttpException ? ELevelsErrors.WARNING : ELevelsErrors.ERROR;
    let status = exception instanceof BusinessException || exception instanceof HttpException ? EStatusTracingGeneral.FAILED : EStatusTracingGeneral.ERROR;
    let _description = exception instanceof BusinessException || exception instanceof HttpException ? exception : undefined;

    let traceability = new Traceability({});
    traceability.setTransactionId(GeneralUtil.getCorrelationalId);
    traceability.setOrigen(req.url);
    traceability.setRequest(request);
    traceability.setResponse(result);
    traceability.setMethod(req.method);
    traceability.setTask(ETaskTracingGeneral.FINAL_REQUEST);
    traceability.setStatus(status);
    this._serviceTracing.createServiceTracing(traceability.getTraceability());

    let task: ITaskError = {
      taskName: exception?.task_name || '',
      taskDescription: exception?.task_description || '',
      description: _description,
    };

    let tracingInfoPrincipal: IServiceTracingInitial = {
      id: GeneralUtil.getCorrelationalId,
      origin: origen,
      method: req.method,
      response: result,
      channel: req.headers.channel,
    };

    this._serviceError.createServiceError(exception, task, request, tracingInfoPrincipal, nivel);

    this.log.write(`Salida Principal - ${req.url} - ${req.method}`, Etask.EXCEPTION_MANAGER, nivel, request, result);
    if(exception instanceof LegacyException)
      response.status(HttpStatus.CREATED).json(result);
    else
      response.status(result.status).json(result);
  }

  async validateException(exception){
    let result: ResponseService;

    if (exception instanceof BusinessException)
      result = new ResponseService(exception.success, exception?.details?.codMessage || exception?.description, exception.code, exception?.details?.document);
    else if (exception instanceof BadRequestException)
      result = new ResponseService(false, EmessageMapping.VALIDATION_FIELD_ERROR, HttpStatus.BAD_REQUEST, exception?.getResponse()['message']);
    else if (exception instanceof LegacyException)
      result = new ResponseService(false, exception.description, exception.code, exception.details.document);
    else if (exception instanceof HttpException)
      result = new ResponseService(false, EmessageMapping.DEFAULT_ERROR, exception.getStatus(), exception?.getResponse()['message']);
    else result = new ResponseService(false, EmessageMapping.DEFAULT_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);

    return result
  }
}
