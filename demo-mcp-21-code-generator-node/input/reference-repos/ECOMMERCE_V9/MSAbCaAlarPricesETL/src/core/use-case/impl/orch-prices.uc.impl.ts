/**
 * Clase para la construcción del orquestador para todos los flujos
 * @author Oscar Robayo
 */
import { Injectable } from '@nestjs/common';
import Logging from '../../../common/lib/logging';
import { IOrchPricesUc } from '../orch-prices.uc';
import { IEventPricesKafkaUc } from '../eventPricesKafka.uc';
import { ELevelsErros } from '../../../common/utils/enums/logging.enum';
import { FamilyParams } from '../../../common/utils/enums/params.enum';
import { IPricesHelper } from '../prices-helper.uc';

@Injectable()
export class OrchPricesUcImpl implements IOrchPricesUc {
  private readonly logger = new Logging(OrchPricesUcImpl.name);

  constructor(
    private readonly _iEventPricesKafkaUc: IEventPricesKafkaUc,
    private readonly _pricesHelper: IPricesHelper,
  ) {}

  /**
   * Función inicial de orquestación que controla el orden de los flujos
   */
  async orchPricesUc(): Promise<any> {
    const values = Object.values(FamilyParams);
    
    for (const family of values) {
      this.logger.write(
        `INICIA FLUJO ${family.toUpperCase()}`,
        `INICIA ${family.toUpperCase()}`,
        ELevelsErros.INFO,
      );
      await this._pricesHelper.pricesHelper(family as FamilyParams);
      this.logger.write(
        `FINALIZA FLUJO ${family.toUpperCase()}`,
        `FINALIZA ${family.toUpperCase()}`,
        ELevelsErros.INFO,
      );
    }

    this.orchPricesKafkaUc();
  }

  /**
   * Función inicial de orquestación que controla los eventos kafka
   */
  async orchPricesKafkaUc(): Promise<any> {
    this._iEventPricesKafkaUc.eventPricesKafka();
  }
}
