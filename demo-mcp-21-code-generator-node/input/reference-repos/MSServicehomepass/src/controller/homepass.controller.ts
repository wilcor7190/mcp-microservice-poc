/**
 * Clase controladora para realizar las respectivas operaciones de consultas e instalacion de servicios en hogares
 * @author Juan David Marin
 */
import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import generalConfig from '../common/configuration/general.config';
import { Swagger } from '../common/utils/enums/message.enum';
import { HomePassDTO } from './dto/hompass/hompass.dto';
import { IHomePassService } from './service/homepass.service';
import { HomePass_200, HomePass_201, HomePass_400, HomePass_500 } from '../mockup/homepass/home-pass.mock';
import Logging from 'src/common/lib/logging';
import { Etask } from 'src/common/utils/enums/task.enum';
import { ELevelsErrors } from 'src/common/utils/enums/logging.enum';

@ApiTags(generalConfig.controllerCoverageHomepass)
@Controller(`${generalConfig.apiVersion}${generalConfig.controllerCoverageHomepass}`)
export class HomepassController {
  private readonly logger = new Logging(HomepassController.name);
  constructor(private _homepass: IHomePassService) {}

  /**
   * Metodo utilizado para validar la cobertura de red de la dirección de un cliente.
   * @param {String} channel Canal ingresado por el usuario en el header
   * @param {HomePassDTO} homePassDTO Informacion ingresada por el usuario para validar cobertura
   * @returns una promesa
   */
  @Post()
  @ApiOperation({ description: Swagger.POST_HOMEPASS })
  @ApiBody({ type: HomePassDTO, description: 'schemas HomePassDTO' })
  @ApiHeader({ name: 'channel', description: 'channel identifier' })
  @ApiResponse({ status: 200, description: Swagger.SUCCESSFUL_RESPONSE, schema: { type: 'application/json', example: HomePass_200 } })
  @ApiResponse({ status: 201, description: Swagger.FAILED_RESPONSE, schema: { type: 'application/json', example: HomePass_201 } })
  @ApiResponse({ status: 400, description: Swagger.WRONG_ANSWER, schema: { type: 'application/json', example: HomePass_400 } })
  @ApiResponse({ status: 500, description: Swagger.INTERNAL_SERVER_ERROR, schema: { type: 'application/json', example: HomePass_500 } })
  consultHomePass(@Headers('channel') channel: string, @Body() homePassDTO: HomePassDTO) {
    this.logger.write('consultHomePass', Etask.CONSULT_HOMEPASS, ELevelsErrors.INFO, homePassDTO);
    return this._homepass.consultHomePass(homePassDTO, channel);
  }
}
