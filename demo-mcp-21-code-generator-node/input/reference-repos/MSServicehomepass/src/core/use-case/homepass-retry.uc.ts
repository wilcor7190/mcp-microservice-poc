/**
 * Clase abstracta para almacenar los metodos de ejecucion del Job directamente a BD
 * @author Juan David Marin
 */
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IHomePassRetryUc {
  /**
   * Firma del metodo para ejecutar el Job directamente a BD
   * @returns una promesa
   */
  abstract getStateHomePass(): any;
}
