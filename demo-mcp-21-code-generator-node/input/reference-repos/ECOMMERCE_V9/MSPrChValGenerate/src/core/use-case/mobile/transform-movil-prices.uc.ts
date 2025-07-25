/**
 * Clase para la transformacion de caracteristicas de precios
 * @author edwin avila
 */
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class ItransformMovilPrices {
    abstract transformOriginalData(array:any)
}