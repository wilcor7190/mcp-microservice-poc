/**
 * job para trazabilidad
 * @author Oscar Robayo
 */
import { Controller } from "@nestjs/common";
import { IServiceTracingUc } from "src/core/use-case/resource/service-tracing.resource.uc";
import { IContingencyService } from "../service/contingency.service";
import generalConfig from "src/common/configuration/general.config";
import Traceability from "src/common/lib/traceability";
import { Cron } from "@nestjs/schedule";
import { EDescriptionTracingGeneral, EStatusTracingGeneral, ETaskTracingGeneral } from "src/common/utils/enums/tracing.enum";
import { TraceabilityDecorator } from '@claro/general-utils-library';
import utils from 'src/common/utils/GeneralUtil';


@Controller()
export class ContingencyJob{

    constructor(
        private readonly _contingencyService: IContingencyService,
        public readonly _serviceTracing: IServiceTracingUc,
    ) {}

  
    @Cron(generalConfig.cronExecutionFeaturesPricesTyT)
    @TraceabilityDecorator() 
    getFeaturesPrices() {
        let traceability = new Traceability({});
        traceability.setTransactionId(utils.getCorrelationalId);
        traceability.setStatus(EStatusTracingGeneral.STATUS_SUCCESS);
        traceability.setDescription(EDescriptionTracingGeneral.START_FEATURES_LOAD_PROCESS);
        traceability.setTask(ETaskTracingGeneral.EXEC_CRON_FEATURES);
        this._serviceTracing.createServiceTracing(traceability.getTraceability());
        this._contingencyService.getData()
    }

    @Cron(generalConfig.cronExecutionMobilePricesAttributes)
    @TraceabilityDecorator()
    getDataMobile() {
        let traceability = new Traceability({});
        traceability.setStatus(EStatusTracingGeneral.STATUS_SUCCESS);
        traceability.setDescription(EDescriptionTracingGeneral.START_MOBILE_PROCESS);
        traceability.setTask(ETaskTracingGeneral.EXEC_MANUAL_MOVIL);
        this._contingencyService.getDataMobile(); 
    }

    @Cron(generalConfig.cronExecutionHomesPricesAttributes) 
    @TraceabilityDecorator()
    getDataHomes() {
        let traceability = new Traceability({});
        traceability.setStatus(EStatusTracingGeneral.STATUS_SUCCESS);
        traceability.setDescription(EDescriptionTracingGeneral.START_HOMES_PROCESS);
        traceability.setTask(ETaskTracingGeneral.EXEC_MANUAL_MOVIL);
        this._contingencyService.getDataHomes(); 
    }

    

}