import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";

import { TraceabilityDecorator } from '@claro/general-utils-library';

import generalConfig from "../../common/configuration/general.config";
import Traceability from "../../common/lib/traceability";
import { IServiceTracingUc } from "../../core/use-case/resource/service-tracing.resource.uc";
import { ICategoriesService } from "../service/categories.service";
import Logging from "../../common/lib/logging";
import { ETaskDesc, ETaskTrace, Etask } from "../../common/utils/enums/taks.enum";

/**
 * Clase donde se definen los métodos para la ejecución del cron
 */
@Injectable()
export class CategoriesJob{

    private readonly logger = new Logging(CategoriesJob.name);

    constructor(
        private readonly _categoriesService: ICategoriesService,
        public readonly _serviceTracing: IServiceTracingUc,
    ) {}

    @Cron(generalConfig.cronExecutionCategories)
    @TraceabilityDecorator()
    featuresJob() {
        this.logger.write(ETaskDesc.START_FEATURES_UPDATE_JOB, Etask.EXEC_CRON_CATEGORIES);
        let traceability = new Traceability({origin: `${generalConfig.apiVersion}${generalConfig.controllerCategories}`});
        traceability.setStatus(ETaskTrace.SUCCESS);
        traceability.setDescription(Etask.EXEC_CRON_CATEGORIES);
        traceability.setTask(ETaskDesc.START_FEATURES_UPDATE_JOB);
        this._serviceTracing.createServiceTracing(traceability.getTraceability());
        return this._categoriesService.jobUpdateFeatures();
    }
}