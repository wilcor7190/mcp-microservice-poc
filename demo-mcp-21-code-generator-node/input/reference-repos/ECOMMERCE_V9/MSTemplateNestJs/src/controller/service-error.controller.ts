/**
 * Clase donde se definen los metodos a exponer por parte del servicio de metodos de errores
 * @author Fredy Santiago Martinez
 */
import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { IServiceErrorService } from 'src/controller/service/service-error.service';
import generalConfig from 'src/common/configuration/general.config';
import { IErrorDTO } from 'src/controller/dto/service-error/service-error.dto';
import { ResponseService } from 'src/controller/dto/response-service.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller(`${generalConfig.apiVersion}${generalConfig.controllerError}`)
export class ServiceErrorController{
    constructor(
        //private readonly _paramService: IParamService,
        private readonly _serviceErrorService: IServiceErrorService
    ) { }

    @Get()
    @ApiResponse({ type: ResponseService })
    async getAll(
        @Query() query : IErrorDTO
    ) {
      
    try {
        return await this._serviceErrorService.getServiceErrors(query.page, query.limit, {
            "_filter":{
                "startDate": query.startDate,
                "endDate": query.endDate
            }});
    } catch (error) {
        throw new BadRequestException(error.message);
    }
    }
}