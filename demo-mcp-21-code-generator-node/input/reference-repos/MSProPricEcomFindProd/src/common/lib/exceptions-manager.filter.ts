/**
 * Clase que intercepta las excepciones en el servicio
 * @author Fredy Santiago Martinez
 */

import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import * as moment from 'moment';
import { ResponseService } from '../../controller/dto/response-service.dto';
import { EmessageMapping } from '../utils/enums/message.enum';
import GeneralUtil from '../utils/generalUtil';
import { BusinessException } from './business-exceptions';
import Logging from './logging';
import { ELevelsErros } from '../utils/enums/logging.enum';
import { EStatusTracingGeneral, ETaskTracingGeneral } from '../utils/enums/tracing.enum';
import Traceability from './traceability';
import { ITaskError } from 'src/core/entity/service-error/task-error.entity';
import { IServiceTracingInicial } from 'src/core/entity/service-tracing/service-tracing.entity';
import { Etask, ETaskDesc } from '../utils/enums/taks.enum';
import { IServiceTracingUc } from 'src/core/use-case/resource/service-tracing.resource.uc';
import { IServiceErrorUc } from 'src/core/use-case/resource/service-error.resource.uc';
import { getOrigin, isEmptyObject } from '@claro/general-utils-library';
import generalConfig from '../configuration/general.config';


@Catch()
export class ExceptionManager implements ExceptionFilter {

  private log: Logging = new Logging(ExceptionManager.name);

  constructor(
    public readonly _serviceTracing: IServiceTracingUc,
    public readonly _serviceError: IServiceErrorUc) { }

  // ...
  async catch(exception, host: ArgumentsHost) {

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const req = ctx.getRequest();
    const startTime = moment(req['startDateTime'])
    const startDateTime = new Date()

    let result: ResponseService;

    if (exception instanceof BusinessException)
      result = new ResponseService(false,  exception?.details?.codMessage || exception?.description, exception.code, exception?.reason, exception?.details?.document, exception.status);
    else if (exception instanceof BadRequestException)
      result = new ResponseService(false, EmessageMapping.ERROR_VALIDATE_FIELDS, exception.getStatus(), exception?.getResponse()['message'], { startDateTime: startDateTime, endDateTime: new Date() });
    else if (exception instanceof HttpException)
      result = new ResponseService(
            false,
            exception.getStatus() === HttpStatus.BAD_REQUEST ? EmessageMapping.DEFAULT_ERROR :  EmessageMapping.BAD_REQUEST,
            exception.getStatus(),
            ETaskDesc.ERROR_BAD_REQUEST);
    else
      result = new ResponseService(false, EmessageMapping.DEFAULT_ERROR, HttpStatus.INTERNAL_SERVER_ERROR, ETaskDesc.ERROR_INTERNAL_SERVER);

    const referenceError: string = getOrigin(generalConfig.apiMapping, req['url']);

    result = {
      ...result,
      validFor: {
        endDateTime: moment(),
        startDateTime: startTime
      },
      responseTime: moment().diff(startTime),
      referenceError
    }

    let request = (isEmptyObject(req.body)) ? req.body : req.query;
    let nivel = (exception instanceof BusinessException || exception instanceof HttpException) ? ELevelsErros.WARNING : ELevelsErros.ERROR;
    let status = (exception instanceof BusinessException || exception instanceof HttpException) ? EStatusTracingGeneral.FAILED : EStatusTracingGeneral.ERROR;
    let _description = (exception instanceof BusinessException || exception instanceof HttpException) ? exception : undefined;


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
      task_name: exception?.task_name || '',
      task_description: exception?.task_description || '',
      description: _description
    }

    let tracingInfoPrincipal: IServiceTracingInicial = {
      id: GeneralUtil.getCorrelationalId,
      referenceError,
      method: req.method,
      response: result,
      channel: req.headers.channel
    }

    this._serviceError.createServiceError(exception, task, request, tracingInfoPrincipal, nivel);

    this.log.write(`Salida Principal - ${req.url} - ${req.method}`, Etask.EXCEPTION_MANAGER, nivel, request, result);

    response
      .status(result.status)
      .json(result);
  }

}