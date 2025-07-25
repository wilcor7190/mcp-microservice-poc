/**
 * Clase donde se definen los metodos a exponer por parte del servicio load Manual
 * @author alexisterzer
 */

import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import generalConfig from "src/common/configuration/general.config";
import Logging from "src/common/lib/logging";
import { IServiceTracingUc } from "src/core/use-case/resource/service-tracing.resource.uc";
import { BulkManualDTO } from "./dto/general/general.dto";
import { IContingencyService } from "./service/contingency.service";
import { ResponseService } from "./dto/response-service.dto";
import { Swagger } from '../common/utils/enums/message.enum';
import { dataSuccess} from '../mockup/data-validate-service';

@ApiTags('Contingency')
@Controller(`${generalConfig.apiVersion}${generalConfig.contingencyController}`)
export class ContingencyController {

    constructor(
        private readonly _contingencyService: IContingencyService,
        public readonly _serviceTracing: IServiceTracingUc,
    ) { }

    private readonly logger = new Logging(ContingencyController.name);


    @Post('/loadManual') 
    @ApiOperation({
        description: 'Carga manual de datos'
    })
    @ApiResponse({ type: ResponseService })
    @HttpCode(HttpStatus.OK)
    @ApiBody({
        type: BulkManualDTO,
        description: "The Description for the Post Body. Please look into the DTO. You will see the @ApiOptionalProperty used to define the Schema.",
        examples: {
            a: {
                summary: "Caracteristicas-Hogares",
                description: "Load Manual",
                value: { category: "Hogares", fileType: "Caracteristicas" } as BulkManualDTO
            },
            b: {
                summary: "Caracteristicas-Movil",
                description: "Load Manual",
                value: { category: "Movil", fileType: "Caracteristicas" } as BulkManualDTO
            },
            c: {
                summary: "Caracteristicas-Equipos",
                description: "Load Manual",
                value: { category: "Equipos", fileType: "Caracteristicas" } as BulkManualDTO
            },
            d: {
                summary: "Precios-Hogares",
                description: "Load Manual",
                value: { category: "Hogares", fileType: "Precios" } as BulkManualDTO
            },
            e: {
                summary: "Precios-Movil",
                description: "Load Manual",
                value: { category: "Movil", fileType: "Precios" } as BulkManualDTO
            },
            f: {
                summary: "Precios-Equipos",
                description: "Load Manual",
                value: { category: "Equipos", fileType: "Precios" } as BulkManualDTO
            },
        }

    })
    @ApiResponse({ status: 200, description: Swagger.SUCCESSFUL_RESPONSE, schema: { type: "application/json", example: dataSuccess } })
    loadManualController(@Body() req: BulkManualDTO) {
        return this._contingencyService.getDataManual(req); 
    }

}
