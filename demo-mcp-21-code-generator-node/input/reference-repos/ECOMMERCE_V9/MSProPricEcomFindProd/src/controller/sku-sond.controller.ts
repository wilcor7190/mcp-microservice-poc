/**
 * Clase en la que se definen los métodos expuestos por el controlador de descuentos.
 * @author Hamilton Acevedo
 */

import { Controller, Get, Headers, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ISkuSondService } from './service/sku-sond.service';
import generalConfig from 'src/common/configuration/general.config';
import Logging from 'src/common/lib/logging';
import { Etask } from 'src/common/utils/enums/taks.enum';
import { ELevelsErros } from 'src/common/utils/enums/logging.enum';
import { SkuQueryDto } from './dto/sku/sku.dto';
import { ESwagger } from 'src/common/utils/enums/message.enum';
import { badRequestResponse, serveErrorResponse, successfullResponse } from 'src/mock/response';


@ApiTags('SKUsond')
@Controller(`${generalConfig.apiVersion}${generalConfig.controllerskusond}`)
export class SKUSondController {
    private readonly logger = new Logging(SKUSondController.name);
    getInfoSku: any;
    constructor(private readonly skuService: ISkuSondService) { }

    @Get()
    @ApiOperation({ description: "Servicio SKU sond" })
    @ApiBody({ type: SkuQueryDto, description: 'Schemas' })
    @ApiResponse({ status: 200, description: ESwagger.SUCCESSFUL_RESPONSE, schema: { type: "application/json", example: successfullResponse } })
    @ApiResponse({ status: 400, description: ESwagger.BAD_REQUEST, schema: { type: "application/json", example: badRequestResponse } })
    @ApiResponse({ status: 500, description: ESwagger.SERVER_ERROR, schema: { type: "application/json", example: serveErrorResponse } })
    SkuSond(@Query() skuQuery: SkuQueryDto, @Headers('channel') channel: string) {
        this.logger.write('SkuSond()', Etask.SKUSOND_CONTROLLER, ELevelsErros.INFO, { skuQuery, channel });
        return this.skuService.getInfoSku(skuQuery.sku, skuQuery.salesType, channel);
    }

}