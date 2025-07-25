/**
 * Obtiene la data de los precios de Movil
 * @author Edwin Avila
 */

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class IGetDataMovilPriceUc {

    abstract getDataMovilPriceUC(): Promise<any>

}