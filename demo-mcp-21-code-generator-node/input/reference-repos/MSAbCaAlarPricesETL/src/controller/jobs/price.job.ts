/**
 * Clase donde se definen los cron a exponer por parte del servicio para la etl de precios
 * @author Oscar Robayo
 */
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TraceabilityDecorator } from '@claro/general-utils-library';
import generalConfig from '../../common/configuration/general.config';
import Traceability from '../../common/lib/traceability';
import {
  EDescriptionTracingGeneral,
  EStatusTracingGeneral,
  ETaskTracingGeneral,
} from '../../common/utils/enums/tracing.enum';
import { IServiceTracingUc } from '../../core/use-case/resource/service-tracing.resource.uc';
import { IPricesService } from '../service/prices.service';

@Injectable()
export class PriceJob {
  constructor(
    private readonly iPricesService: IPricesService,
    public readonly _serviceTracing: IServiceTracingUc,
  ) {}

  @Cron(generalConfig.cronPricesEtl)
  @TraceabilityDecorator()
  pricesJob() {
    let traceability = new Traceability({});
    traceability.setStatus(EStatusTracingGeneral.STATUS_SUCCESS);
    traceability.setDescription(EDescriptionTracingGeneral.START_JOB_PROCESS);
    traceability.setTask(ETaskTracingGeneral.EXEC_CRON);
    this._serviceTracing.createServiceTracing(traceability.getTraceability());
    return this.iPricesService.pricesProcess();
  }
}
