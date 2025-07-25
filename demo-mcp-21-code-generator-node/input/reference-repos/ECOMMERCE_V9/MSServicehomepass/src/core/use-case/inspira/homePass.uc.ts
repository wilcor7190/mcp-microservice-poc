/**
 * Clase abstracta para realizar las respectivas consultas de informacion de hogares a legados
 * @author Juan David Marin
 */
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IHomePassUc {
  /**
   * Firma del metodo utilizado para validar la cobertura de red de la dirección de un cliente.
   * @param {string} channel Canal ingresado por el usuario en el header
   * @param {any} data Informacion ingresada por el usuario para validar cobertura
   */
  abstract initialFunction(data: any, channel: string): any;
}
