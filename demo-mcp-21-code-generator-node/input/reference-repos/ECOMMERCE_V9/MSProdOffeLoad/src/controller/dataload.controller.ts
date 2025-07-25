/**
 * Clase donde se definen los metodos a exponer por parte del servicio para los metodos de creación de dataloads
 * @author Santiago Vargas
 */

import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import generalConfig from '../common/configuration/general.config';
import Logging from '../common/lib/logging';
import { DataLoad } from '../common/utils/enums/mapping-api-rest';
import { Swagger } from '../common/utils/enums/message.enum';
import { Etask } from '../common/utils/enums/taks.enum';
import { responseBadRequest, responseSuccess } from '../data-provider/model/dataload/response-dataload.model';
import { IDataloadDTO } from './dto/dataload/dataload.dto';
import { ResponseService } from './dto/response-service.dto';
import { IDataloadService } from './service/dataload.service';

@ApiTags(generalConfig.controllerEvents)
@Controller(generalConfig.controllerEvents)
export class DataloadController {
  constructor(private readonly _dataloadService: IDataloadService) { }

  private readonly logger = new Logging(DataloadController.name);

  @Post(DataLoad.DATALOAD_MANUAL)
  @ApiOperation({operationId: "generateDataloadManual", description: Swagger.GENERATE_DATALOAD})
  @ApiBody({ type: IDataloadDTO, description:'schemas DataloadDTO' })
  @ApiResponse({ status: HttpStatus.OK, description: Swagger.SUCCESSFUL_RESPONSE, schema:{ type: "application/json", example: responseSuccess }})
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: Swagger.BAD_REQUEST, schema:{ type: "application/json", example: responseBadRequest }})
  @ApiCreatedResponse({type: ResponseService })
  async generateDataloadManual(@Body() req: IDataloadDTO) {
    this.logger.write('generateDataloadManual()', `${Etask.DATALOAD_MANUAL}, ${req}`);
    return this._dataloadService.generateDataloadManual(req);
  }
}
