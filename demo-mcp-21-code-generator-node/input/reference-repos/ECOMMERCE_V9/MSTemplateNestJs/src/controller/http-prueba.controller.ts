/**
 * Clase donde se definen los metodos a exponer por parte del servicio de metodos de peticiones
 * @author Fredy Santiago Martinez
 */
import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import generalConfig from "src/common/configuration/general.config";
import { ResponseService } from "./dto/response-service.dto";
import { IHttpPruebaService } from "./service/http-prueba.service";

@ApiTags('httpProvider')
@Controller(`${generalConfig.apiVersion}${generalConfig.controllerHttpProvider}`)
export class HttpPruebaController {
  constructor(private readonly _httpPruebaService: IHttpPruebaService) {}

  @Get('/:id')
  @ApiOperation({ 
    description: 'Petición de httpProvider por id' 
  })
  @ApiResponse({ type: ResponseService })
  getById(@Param('id') _id: string) {
    return this._httpPruebaService.getById(_id);
  }

  
  @Get()
  @ApiOperation({ 
    description: 'Petición de httpProvider con paginado' 
  })
  @ApiResponse({ type: ResponseService })
  getAll(
    @Query('page', ParseIntPipe) _page: number = 1,
    @Query('limit', ParseIntPipe) _limit: number = 15
  ) {
    return this._httpPruebaService.getAll(_page, _limit);
  }

}