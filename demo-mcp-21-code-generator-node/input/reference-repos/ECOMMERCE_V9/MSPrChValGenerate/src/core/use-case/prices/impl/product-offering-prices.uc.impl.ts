/**
 * clase para el ftp de prices
 * @author Gabriel Garzon
 */

import { Injectable } from '@nestjs/common';
import Logging from 'src/common/lib/logging';
import { Etask, ETaskDesc } from 'src/common/utils/enums/taks.enum';
import utils from 'src/common/utils/GeneralUtil';
import { ELevelsErros } from 'src/common/utils/enums/logging.enum';
import {
  EDescriptionTracingGeneral,
  EStatusTracingGeneral,
  ETaskTracingGeneral,
} from 'src/common/utils/enums/tracing.enum';
import { IGetErrorTracingUc } from 'src/core/use-case/resource/get-error-tracing.resource.uc';
import { IPricesProductOfferingUC } from '../product-offering-prices.uc';
import { IPricesListDTO } from 'src/controller/dto/general/prices/price.dto';
import { IServiceTracingUc } from '../../resource/service-tracing.resource.uc';
import { IPriceProvider } from 'src/data-provider/provider/prices/price.provider';

@Injectable()
export class PricesProductOfferingUC implements IPricesProductOfferingUC {
  private readonly logger = new Logging(PricesProductOfferingUC.name);

  constructor(
    public readonly _GetErrorTracing: IGetErrorTracingUc,
    public readonly _serviceTracing: IServiceTracingUc,
    private readonly _pricesProvider: IPriceProvider,
  ) {}

  async saveTransformData(content: IPricesListDTO): Promise<any> {
    try {
      const START_TIME = process.hrtime();
      const SAVE = await this._pricesProvider.saveTransformData(content);
      const processingTime = this.processExecutionTime(START_TIME);
      this.logger.write(
        'Guardando transform data',
        Etask.SAVE_TRANSFORMDATA,
        ELevelsErros.INFO,
        '',
        '',
        processingTime,
      );
      return SAVE;
    } catch (error) {
      await this._GetErrorTracing.createTraceability(
        EStatusTracingGeneral.ERROR,
        EDescriptionTracingGeneral.SAVE_DATA_COLECCTIONS,
        ETaskTracingGeneral.SAVE_DATA,
      );
      this.logger.write(
        'saveTransformData()' + error.stack,
        Etask.SAVE_TRANSFORMDATA,
        ELevelsErros.ERROR,
      );
      utils.assignTaskError(
        error,
        Etask.SAVE_TRANSFORMDATA,
        ETaskDesc.SAVE_DATA,
      );
      await this._GetErrorTracing.getError(error);
    }
  }

  async deleteDataColPrtProductOffering(family: any): Promise<any> {
    try {
      const START_TIME = process.hrtime();
      const DELETE = await this._pricesProvider.deleteDataColPrtProductOffering(family);
      const processingTime = this.processExecutionTime(START_TIME);
      this.logger.write(
        'Borrando data ColPrtProductOffering',
        Etask.DELETE_DATACOLPRTPRODUCTOFFERING,
        ELevelsErros.INFO,
        family,
        '',
        processingTime,
      );
      return DELETE;
    } catch (error) {
      await this._GetErrorTracing.createTraceability(
        EStatusTracingGeneral.ERROR,
        EDescriptionTracingGeneral.FEATURES_COLL_COLPRTPRODUCTOFFERING,
        ETaskTracingGeneral.DELETE_DATA,
      );
      this.logger.write(
        'deleteDataColPrtProductOffering()' + error.stack,
        Etask.DELETE_DATACOLPRTPRODUCTOFFERING,
        ELevelsErros.ERROR,
      );
      utils.assignTaskError(
        error,
        Etask.DELETE_DATACOLPRTPRODUCTOFFERING,
        ETaskDesc.DELETE_DATA,
      );
      await this._GetErrorTracing.getError(error);
    }
  }

  /**
   * Función para generar log informativo para el services provider de Message
   * @param {any} startTime cadena fecha inicio consulta bd
   */
  processExecutionTime(startTime: any): number {
    const endTime = process.hrtime(startTime);
    return Math.round(endTime[0] * 1000 + endTime[1] / 1000000);
  }
}
