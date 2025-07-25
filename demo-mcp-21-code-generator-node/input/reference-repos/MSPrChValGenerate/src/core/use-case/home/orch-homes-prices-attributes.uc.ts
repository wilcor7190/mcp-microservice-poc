/**
 * Obtiene la configuracion y construción principal de la capa de negocio
 * @author Oscar Robayo
 */

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class IHomesPricesAttributesUc {

    abstract getOrchHomes(): Promise<any>;

    abstract getHomeAttributes(): Promise<any>;

    abstract getHomePrices(): Promise<any>;

}