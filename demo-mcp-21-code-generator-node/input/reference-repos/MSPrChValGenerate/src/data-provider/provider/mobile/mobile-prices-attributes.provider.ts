/**
 * clase abstracta donde se define el provider de atributos para el flujo moviles
 * * @author Oscar Robayo
 */
import { Injectable } from '@nestjs/common';
import { Etask } from 'src/common/utils/enums/taks.enum';

@Injectable()
export abstract class IMobilePricesAttributesProvider {
  abstract saveDataMobileGeneralPrices(general: any): Promise<void>;
  abstract saveDataMobileGeneralAttributes(general: any): Promise<void>;
  abstract deleteDataMobileAttributes(): Promise<void>;
  abstract saveDataTemporalCollectionMovil(
    nameCollection: string,
    content: any,
  );
  abstract deleteDataMobilePrices(): Promise<void>;
  abstract createLog(request: any, startTime: any, task: Etask);
}
