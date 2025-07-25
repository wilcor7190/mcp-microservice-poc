/**
 * Clase controladora para realizar las respectivas operaciones de consulta de barrios por codigo Dane
 * @author Juan David Marin
 */
import { Controller, Headers, Get, Query } from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import generalConfig from '../common/configuration/general.config';
import { INeighborhoodbydane } from './service/neighborhoodbydane.service';
import { NeighborhoodbydaneDTO } from './dto/neighborhoodbydane/neighborhoodbydane.dto';
import { Swagger } from '../common/utils/enums/message.enum';
import { NeighborHood_200, NeighborHood_201, NeighborHood_400, NeighborHood_500 } from '../mockup/Neighborhoodbydane/responseNeighbordhoodbydane.mock';
import Logging from 'src/common/lib/logging';
import { Etask } from 'src/common/utils/enums/task.enum';
import { ELevelsErrors } from 'src/common/utils/enums/logging.enum';

@ApiTags(generalConfig.controllerCoverageNeighborhoodbydane)
@Controller(`${generalConfig.apiVersion}${generalConfig.controllerCoverageNeighborhoodbydane}`)
export class NeighborhoodbydaneController {
  private readonly logger = new Logging(NeighborhoodbydaneController.name);
  constructor(private _neighborhoodbydan: INeighborhoodbydane) {}

  /**
   * Metodo que realiza la consulta de un barrio o barrios por el departamento y municipio enviado Para estandarizar la dirección del cliente en la tienda virtual
   * @param {string} channel
   * @param {string} token
   * @param {NeighborhoodbydaneDTO} neighborhoodbydaneDto
   * @returns una promesa
   */
  @Get()
  @ApiOperation({ description: Swagger.GET_NEIGHBORHOOSBYDANE })
  @ApiHeader({ name: 'channel', description: 'channel identifier' })
  @ApiHeader({ name: 'token', description: 'token identifier' })
  @ApiBody({ type: NeighborhoodbydaneDTO, description: 'schemas NeighborhoodbydaneDTO' })
  @ApiResponse({ status: 200, description: Swagger.SUCCESSFUL_RESPONSE, schema: { type: 'application/json', example: NeighborHood_200 } })
  @ApiResponse({ status: 201, description: Swagger.FAILED_RESPONSE, schema: { type: 'application/json', example: NeighborHood_201 } })
  @ApiResponse({ status: 400, description: Swagger.WRONG_ANSWER, schema: { type: 'application/json', example: NeighborHood_400 } })
  @ApiResponse({ status: 500, description: Swagger.INTERNAL_SERVER_ERROR, schema: { type: 'application/json', example: NeighborHood_500 } })
  consultNeighborhoodbydane(@Headers('channel') channel: string, @Headers('token') token: string, @Query() neighborhoodbydaneDto: NeighborhoodbydaneDTO) {
    this.logger.write('consultNeighborhoodbydane()', Etask.CONSULT_NEIGHBORHOOD_BY_DANE, ELevelsErrors.INFO, neighborhoodbydaneDto);
    return this._neighborhoodbydan.consultNeighborhoodbydane(channel, token, neighborhoodbydaneDto);
  }
}
