/**
 * Clase controladora para realizar las respectivas operaciones de detalles de direcciones
 * @author Sebastian Traslaviña
 */
import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import generalConfig from '../common/configuration/general.config';
import { IDetailAddress } from './service/detailAddress.service';
import { GeographicDto } from './dto/geographic/geographic.dto';
import { Swagger } from '../common/utils/enums/message.enum';
import { DetailAddress_200, DetailAddress_201, DetailAddress_400, DetailAddress_500 } from '../mockup/DetailAddress/detail-address.mock';
import Logging from 'src/common/lib/logging';

@ApiTags(generalConfig.controllerCoverageDetailAddress)
@Controller(`${generalConfig.apiVersion}${generalConfig.controllerCoverageDetailAddress}`)
export class DetailAddressController {
  private readonly logger = new Logging(DetailAddressController.name);
  constructor(private _detailAddress: IDetailAddress) {}

  /**
   * Metodo que realiza la consulta de barrio o barrios por dirección para estandarizar la dirección del cliente en la tienda virtual
   * @param {String} channel canal ingresado por el usuario en el header
   * @param {String} token token ingresado por el usuario en el header
   * @param {GeographicDto} geographicDto Detalles de direccion ingresada por el usuario
   * @returns una promesa
   */
  @Post()
  @ApiOperation({ operationId: 'consultDetailsAddres', description: Swagger.POST_DETAIL_DESCRIPTION })
  @ApiBody({ type: GeographicDto, description: 'schemas GeographicDto' })
  @ApiHeader({ name: 'channel', description: 'channel identifier' })
  @ApiResponse({ status: 200, description: Swagger.SUCCESSFUL_RESPONSE, schema: { type: 'application/json', example: DetailAddress_200 } })
  @ApiResponse({ status: 201, description: Swagger.FAILED_RESPONSE, schema: { type: 'application/json', example: DetailAddress_201 } })
  @ApiResponse({ status: 400, description: Swagger.WRONG_ANSWER, schema: { type: 'application/json', example: DetailAddress_400 } })
  @ApiResponse({ status: 500, description: Swagger.INTERNAL_SERVER_ERROR, schema: { type: 'application/json', example: DetailAddress_500 } })
  consultDetailsAddres(@Headers('channel') channel: string, @Headers('token') token: string, @Body() geographicDto: GeographicDto) {
    return this._detailAddress.consultDetailsAddres(geographicDto, channel, token);
  }
}
