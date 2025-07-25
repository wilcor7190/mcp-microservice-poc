/**
 * Clase abstracta para realizar la validación de los canales permitidos en el ms
 * @author Oscar Avila
 */
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IGlobalValidateService {
  /**
   * Consulta si un canal recibido es correcto
   * @param {String} channel Canal recibido por el usuario en header
   */
  abstract validateChannel(channel: string): any;
}
