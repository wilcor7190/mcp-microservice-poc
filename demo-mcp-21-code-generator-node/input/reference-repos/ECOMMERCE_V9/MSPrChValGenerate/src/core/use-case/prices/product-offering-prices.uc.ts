/**
 * clase para ejecutar consultas a produyct offering relacionadas a precios
 * @author Daniel C Rubiano R
 */

import { Injectable } from '@nestjs/common';
import { IPricesListDTO } from 'src/controller/dto/general/prices/price.dto';

@Injectable()
export abstract class IPricesProductOfferingUC {
  abstract saveTransformData(content: IPricesListDTO): Promise<any>;
  abstract deleteDataColPrtProductOffering(params: any): Promise<void>;
}
