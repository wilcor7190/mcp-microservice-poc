/**
 * Clase donde se definen los metodos a exponer por parte del servicio para la etl Precios
 */
import { Controller, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import generalConfig from "../common/configuration/general.config";
import Traceability from "../common/lib/traceability";
import { Swagger } from "../common/utils/enums/message.enum";
import { EDescriptionTracingGeneral, EStatusTracingGeneral, ETaskTracingGeneral } from "../common/utils/enums/tracing.enum";
import { IServiceTracingUc } from "../core/use-case/resource/service-tracing.resource.uc";
import { dataFailed, dataSuccess } from "../mockup/data-validate-service";
import { IPricesService } from "./service/prices.service";


@ApiTags('PricesETL')
@Controller(generalConfig.apiVersion)
export class PriceController{

    constructor(
        private readonly iPricesService: IPricesService,
        public readonly _serviceTracing: IServiceTracingUc,
    ) {}
    
    @Post(`${generalConfig.controllerManual}`)
    @ApiOperation({operationId: "GetPricesManual", description: Swagger.GENERATE_PRICES})
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: Swagger.BAD_REQUEST, schema:{ type: "application/json", example: dataFailed }})
    @ApiResponse({ status: HttpStatus.OK, description: Swagger.SUCCESSFUL_RESPONSE, schema:{ type: "application/json", example: dataSuccess }})
    getPricesManual() {
        let traceability = new Traceability({});
        traceability.setStatus(EStatusTracingGeneral.STATUS_SUCCESS);
        traceability.setDescription(EDescriptionTracingGeneral.START_MANUAL_PROCESS);
        traceability.setTask(ETaskTracingGeneral.EXEC_MANUAL);
        return this.iPricesService.pricesProcess();
    }
}