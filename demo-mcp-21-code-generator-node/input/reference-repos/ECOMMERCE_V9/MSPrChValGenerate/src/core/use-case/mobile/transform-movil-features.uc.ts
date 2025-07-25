/**
 * clase para la transformacion de las caracteristicas de movil
 * @author Uriel Esguerra
 */

import { Injectable } from '@nestjs/common';
@Injectable()
export abstract class ItransformMovilFeatures {
    abstract transformOriginalData(array:any)
}