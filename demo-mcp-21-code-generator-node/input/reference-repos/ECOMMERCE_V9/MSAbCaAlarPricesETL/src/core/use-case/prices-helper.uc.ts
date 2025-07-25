/**
 * Clase para la construcción del orquestador para todos los flujos
 * @author Daniel C Rubiano R
 */
import { Injectable } from '@nestjs/common';
import { FamilyParams } from '../../common/utils/enums/params.enum';

@Injectable()
export abstract class IPricesHelper {
  /**
   * Metodo para logica compartida
   * @param {FamilyParams} family nombre de la coleccion
   */
  abstract pricesHelper(family: FamilyParams): Promise<any>;
}
