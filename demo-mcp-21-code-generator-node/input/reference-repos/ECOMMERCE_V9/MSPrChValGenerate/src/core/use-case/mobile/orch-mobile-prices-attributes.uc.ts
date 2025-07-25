/**
 * clase para el orquestrador de precios y caracteristicas de mobile
 * @author Oscar Robayo
 */

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class IMobilePricesAttributesUc {
    
    abstract getOrchMobile(): Promise<any>

    abstract getMovileAttributes(): Promise<any>;

    abstract getMobilePrices(): Promise<any>;
}