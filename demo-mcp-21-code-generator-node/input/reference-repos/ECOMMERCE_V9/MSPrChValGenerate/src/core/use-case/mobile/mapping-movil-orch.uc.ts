/**
 * Obtiene el mapeo del precio y las caracteristicas de movil
 * @author Uriel Esguerra
 */

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class IMappingMovilOrchUC {

    abstract mappingMovilOrch(arrayPrice ,arrayFeatures): Promise<any>

}