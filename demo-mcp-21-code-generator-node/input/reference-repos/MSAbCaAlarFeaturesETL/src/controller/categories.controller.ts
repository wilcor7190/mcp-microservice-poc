import { Controller, HttpStatus, Post } from "@nestjs/common";
import { ApiCreatedResponse, ApiOperation, ApiResponse } from "@nestjs/swagger";
import generalConfig from "../common/configuration/general.config";
import Logging from "../common/lib/logging";
import Traceability from "../common/lib/traceability";
import { Swagger } from "../common/utils/enums/message.enum";
import { ETaskDesc, ETaskTrace, Etask } from "../common/utils/enums/taks.enum";
import { IServiceTracingUc } from "../core/use-case/resource/service-tracing.resource.uc";
import { responseFail, responseSuccess } from "../data-provider/model/categories/response-manual.model";
import { ResponseService } from "./dto/response-service.dto";
import { ICategoriesService } from "./service/categories.service";
/**
 * Clase donde se definen los metodos a exponer por parte del servicio para los metodos de actualización de caracteristicas
 * @author Santiago Vargas
 */
@Controller(`${generalConfig.apiVersion}${generalConfig.controllerCategories}`)
export class CategoriesController {

    private readonly logger = new Logging(CategoriesController.name);

    constructor(
        private readonly _categoriesService: ICategoriesService,
        private readonly _serviceTracing: IServiceTracingUc
    ) {}

    @Post()
    @ApiOperation({ operationId: "generateDataloadManual", description: Swagger.UPDATE_FEATURE })
    @ApiResponse({ status: HttpStatus.OK, description: Swagger.SUCCESSFUL_RESPONSE, schema:{ type: "application/json", example: responseSuccess }})
    @ApiResponse({ status: HttpStatus.CREATED, description: Swagger.WRONG_ANSWER, schema:{ type: "application/json", example: responseFail }})
    @ApiCreatedResponse({type: ResponseService })    
    async updateFeatures() {
        this.logger.write(ETaskDesc.START_UPDATE_FEATURES, Etask.UPDATE_FEATURES);
        let traceability = new Traceability({origin: `${generalConfig.apiVersion}${generalConfig.controllerCategories}`});
        traceability.setStatus(ETaskTrace.SUCCESS);
        traceability.setDescription(Etask.UPDATE_FEATURES);
        traceability.setTask(ETaskDesc.START_UPDATE_FEATURES);
        this._serviceTracing.createServiceTracing(traceability.getTraceability());
        return this._categoriesService.updateFeatures();
    }
}

