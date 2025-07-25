/**
 * Obtiene la data de las caracteristicas de Movil
 * @author Uriel Esguerra
 */

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class IGetDataMovilFeatureUc {

    abstract getDataMovilFeatureUC(): Promise<any>

}