/**
 * Clase controladora para realizar las respectivas operaciones de complementos de direcciones
 * @Author Sebastian Traslaviña
 */

import { Controller, Headers, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import generalConfig from '../common/configuration/general.config';
import { Swagger } from '../common/utils/enums/message.enum';
import { GeographicAdDto } from './dto/geographicAddres/geographicAddress.dto';
import { ResponseService } from './dto/response-service.dto';
import { IAddressComplement } from './service/address-complement.service';
import Logging from 'src/common/lib/logging';
import { Etask } from 'src/common/utils/enums/task.enum';
import { ELevelsErrors } from 'src/common/utils/enums/logging.enum';

@ApiTags(generalConfig.controllerCoverageAddressComplement)
@Controller(`${generalConfig.apiVersion}${generalConfig.controllerCoverageAddressComplement}`)
export class AddressComplementController {
  private readonly logger = new Logging(AddressComplementController.name);

  constructor(private _addressComplement: IAddressComplement) {}

  /**
   * Metodo utilizado para consultar posibles complementos de direcciones
   * @param {String} channel canal ingresado por el usuario en el header
   * @param {GeographicAdDto} geographicDto informacion relacionada a la direccion ingresada por el cliente
   * @returns {Promise<ResponseService>} retorna direccion del cliente estandarizada
   */
  @Post()
  @ApiOperation({ operationId: 'consultAddressComplement', description: Swagger.POST_ADDRESS_DESCRIPTION })
  @ApiBody({ type: GeographicAdDto, description: 'schemas GeographicAdDto' })
  @ApiHeader({ name: 'channel', description: 'channel identifier' })
  @ApiResponse({ type: ResponseService })
  @HttpCode(HttpStatus.OK)
  consultAddressComplement(@Headers('channel') channel: string, @Body() geographicDto: GeographicAdDto): Promise<ResponseService> {
    this.logger.write('consultAddressComplement()', Etask.CONSULT_ADDRESS, ELevelsErrors.INFO, geographicDto);
    return this._addressComplement.consultAddressComplement(channel, geographicDto);
  }
}
