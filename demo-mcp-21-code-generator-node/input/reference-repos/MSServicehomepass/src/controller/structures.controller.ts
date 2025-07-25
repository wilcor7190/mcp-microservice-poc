/**
 * Clase controladora para realizar las respectivas operaciones de estructuras de direcciones
 * @author Juan David Marin 
 */
import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import generalConfig from '../common/configuration/general.config';
import { StructuresDTO } from './dto/structures/structures.dto';
import { Structures_200, Structures_201, Structures_400, Structures_500 } from '../mockup/structures/structures.mock';
import { Swagger } from '../common/utils/enums/message.enum';
import Logging from 'src/common/lib/logging';
import { IStructuresService } from './service/structure.service';

@ApiTags(generalConfig.controllerCoverageStructures)
@Controller(`${generalConfig.apiVersion}${generalConfig.controllerCoverageStructures}`)
export class StructuresController {
  private readonly logger = new Logging(StructuresController.name);
  constructor(private _structures: IStructuresService) {}

  /**
   * Metodo que realiza la consulta del filtro de las estructuras, por los tipos de dirección enviada. para estandarizar la dirección del cliente en la tienda virtual
   * @param {string} channel canal ingresado por el usuario en el header
   * @param {StructuresDTO} structuresDTO informacion de direccion
   * @returns una promesa
   */
  @Post()
  @ApiOperation({ description: Swagger.POST_CLIENT_HOMEPASS })
  @ApiBody({ type: StructuresDTO })
  @ApiResponse({ status: 200, description: Swagger.SUCCESSFUL_RESPONSE, schema: { type: 'application/json', example: Structures_200 } })
  @ApiResponse({ status: 201, description: Swagger.FAILED_RESPONSE, schema: { type: 'application/json', example: Structures_201 } })
  @ApiResponse({ status: 400, description: Swagger.WRONG_ANSWER, schema: { type: 'application/json', example: Structures_400 } })
  @ApiResponse({ status: 500, description: Swagger.INTERNAL_SERVER_ERROR, schema: { type: 'application/json', example: Structures_500 } })
  consultStructures(@Headers('channel') channel: string, @Body() structuresDTO: StructuresDTO) {
    return this._structures.consultStructures(structuresDTO, channel);
  }
}
