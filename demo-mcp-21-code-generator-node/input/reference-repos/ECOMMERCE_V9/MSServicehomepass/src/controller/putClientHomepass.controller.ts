/**
 * Clase controladora para realizar las respectivas operaciones de consulta de clientes con ordenes de servicio
 * @author Juan David Marin
 */
import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import generalConfig from '../common/configuration/general.config';
import { Swagger } from '../common/utils/enums/message.enum';
import { CLienthomepassDto } from './dto/clienthomepass/clienthomepass.dto';
import { IPutClientHomepass } from './service/putClientHomepass.service';
import { Client_200, PutClient_201, Client_400, Client_500 } from '../mockup/PutClientHomepass/responsePutClientHomepass.mock';
import Logging from 'src/common/lib/logging';
import { Etask } from 'src/common/utils/enums/task.enum';
import { ELevelsErrors } from 'src/common/utils/enums/logging.enum';

@ApiTags(generalConfig.controllerCoverageStructures)
@Controller(`${generalConfig.apiVersion}${generalConfig.controllerCoveragePutClientHomepass}`)
export class PutClientHomepassController {
  private readonly logger = new Logging(PutClientHomepassController.name);
  constructor(private _putClientHomepass: IPutClientHomepass) {}

  /**
   * Metodo que se utiliza para validar la cobertura de red de la dirección de un cliente.
   * @param {string} channel canal ingresado por el cliente en el header
   * @param {CLienthomepassDto} cLienthomepassDto informacion ingresada por el cliente
   * @returns una promesa
   */
  @Post()
  @ApiOperation({ description: Swagger.POST_CLIENT_HOMEPASS })
  @ApiBody({ type: CLienthomepassDto, description: 'schemas CLienthomepassDto' })
  @ApiHeader({ name: 'channel', description: 'channel identifier' })
  @ApiResponse({ status: 200, description: Swagger.SUCCESSFUL_RESPONSE, schema: { type: 'application/json', example: Client_200 } })
  @ApiResponse({ status: 201, description: Swagger.FAILED_RESPONSE, schema: { type: 'application/json', example: PutClient_201 } })
  @ApiResponse({ status: 400, description: Swagger.WRONG_ANSWER, schema: { type: 'application/json', example: Client_400 } })
  @ApiResponse({ status: 500, description: Swagger.INTERNAL_SERVER_ERROR, schema: { type: 'application/json', example: Client_500 } })
  consultPutClientHomepass(@Headers('channel') channel: string, @Body() cLienthomepassDto: CLienthomepassDto) {
    this.logger.write('consultPutClientHomepass()', Etask.CONSULT_PUT_CLIENT_HOMEPASS, ELevelsErrors.INFO, cLienthomepassDto);
    return this._putClientHomepass.consultPutClientHomepass(channel, cLienthomepassDto);
  }
}
