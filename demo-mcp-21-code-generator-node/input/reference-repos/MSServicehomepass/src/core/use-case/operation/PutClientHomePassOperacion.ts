/**
 * Clase abstracta para almacenar las operaciones a realizar en flujo operacion
 * @author Sebastian Traslaviña
 */

import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IPutClientHomePassOperacion {
  /**
   * Firma del metodo que se utiliza para consumir el flujo operacion
   */
  abstract provitionalFunction(): any;
}
