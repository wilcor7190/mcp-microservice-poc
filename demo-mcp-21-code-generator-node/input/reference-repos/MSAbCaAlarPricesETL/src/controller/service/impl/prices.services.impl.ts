/**
 * Clase donde se definen los metodos del servicio para la etl Precios
 */
import { Injectable } from '@nestjs/common';
import { ResponseService } from '../../../controller/dto/response-service.dto';
import { IOrchPricesUc } from '../../../core/use-case/orch-prices.uc';
import { IPricesService } from '../prices.service';
import Logging from '../../../common/lib/logging';
import Traceability from '../../../common/lib/traceability';
import {
  EStatusTracingGeneral,
  EDescriptionTracingGeneral,
} from '../../../common/utils/enums/tracing.enum';
import { ELevelsErros } from '../../../common/utils/enums/logging.enum';
import GeneralUtil from '../../../common/utils/generalUtil';
import { IServiceTracingUc } from '../../../core/use-case/resource/service-tracing.resource.uc';
import * as APM from '@claro/general-utils-library';

@Injectable()
export class PricesServiceImpl implements IPricesService {
  constructor(
    private readonly _orchPricesUc: IOrchPricesUc,
    public readonly _serviceTracing: IServiceTracingUc,
  ) {}

  private readonly logger = new Logging(PricesServiceImpl.name);

  /**
   * Valida el proceso de creacion de data de precios
   * @returns Retorno respuesta del servicio
   */
  async pricesProcess(): Promise<ResponseService> {
    const transaction = await APM.startTransaction(`jobpricesProcess - Inicia el proceso de actualización`);
    try {
      this.logger.write(
        'START CALLING ORCHASTRATOR',
        EDescriptionTracingGeneral.START_CALL_ORCHESTRATOR,
        ELevelsErros.INFO,
      );
      const traceability = new Traceability({});
      traceability.setTransactionId(GeneralUtil.getCorrelationalId);
      traceability.setStatus(EStatusTracingGeneral.STATUS_SUCCESS);
      traceability.setDescription(
        EDescriptionTracingGeneral.START_CALL_ORCHESTRATOR,
      );
      traceability.setTask('START CALLING ORCHASTRATOR');
      this._serviceTracing.createServiceTracing(traceability.getTraceability());
  
      this._orchPricesUc.orchPricesUc();
      return new ResponseService(true, 'La carga inició', 200);
    } finally {
      transaction.end();
    }
  }
}
