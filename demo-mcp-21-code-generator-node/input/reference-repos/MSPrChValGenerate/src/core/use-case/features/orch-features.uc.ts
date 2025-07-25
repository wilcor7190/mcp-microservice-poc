/**
 * Clase para el orquestrador
 * @author Juan Gabriel Garzon
 */

import { Injectable } from "@nestjs/common";



@Injectable()
export abstract class IFeaturesUC {

    abstract getOrch(): Promise<any>

}