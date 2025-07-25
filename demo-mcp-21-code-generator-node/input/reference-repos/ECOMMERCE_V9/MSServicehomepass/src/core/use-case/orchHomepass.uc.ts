/**
 * Clase abstracta para orquestar las operaciones que es posible realizar por medio del servicio
 * @author Juan David Marin
 */
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IOrchHomepassUc {
  /**
   * Firma del metodo para orquestar las funciones posibles a realizar
   * @param {string} channel Canal ingresado por el usuario en el header
   * @param {any} data Informacion ingresada por el usuario para validar cobertura
   */
  abstract initialFunction(data: any, channel: string): any;
}
