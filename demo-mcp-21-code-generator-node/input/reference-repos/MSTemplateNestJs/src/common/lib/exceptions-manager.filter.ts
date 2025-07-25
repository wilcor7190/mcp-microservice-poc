/**
 * Clase que intercepta las excepciones en el servicio
 * @author Fredy Santiago Martinez
 */

import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Response } from 'express';
import * as moment from 'moment';
import { ResponseService } from "../../controller/dto/response-service.dto";
import { EmessageMapping } from "../utils/enums/message.enum";
import GeneralUtil from "../utils/generalUtil";
import { BusinessException } from './business-exceptions';
import Logging from "./logging";


@Catch()
export class ExceptionManager implements ExceptionFilter {

  private log: Logging = new Logging(ExceptionManager.name);

  // ...
  async catch(exception, host: ArgumentsHost) {

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const req = ctx.getRequest();

    let result: ResponseService;

    if (exception instanceof BusinessException)
      result = new ResponseService(exception.success, exception ?.details ?.codMessage || exception ?.description, exception.code, exception ?.details ?.document);
    else if (exception instanceof HttpException)
      result = new ResponseService(false, EmessageMapping.DEFAULT_ERROR, exception.getStatus(), exception ?.getResponse()['message']);
    else
      result = new ResponseService(false, EmessageMapping.DEFAULT_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);

    const origen: string = GeneralUtil.getOrigin(req['url']);

    result = {
      ...result,
      requestTime: moment().format(),
      method: req.method,
      origen
    }

    response
      .status(result.status)
      .json(result);
  }

}