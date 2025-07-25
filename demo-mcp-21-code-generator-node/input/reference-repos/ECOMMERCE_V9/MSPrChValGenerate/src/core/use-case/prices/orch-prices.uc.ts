/**
 * clase para el orquestrador de precios
 * @author Gabriel Garzon
 */

import { Injectable } from "@nestjs/common";



@Injectable()
export abstract class IPricesUc {

    abstract getOrch(): Promise<any>

}