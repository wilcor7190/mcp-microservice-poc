/**
 * Clase que se implementa para almacenar las operaciones a realizar en flujo operacion
 * @author Sebastian Traslaviña
 */

import { Injectable } from '@nestjs/common';
import { EmessageMapping } from '../../../../common/utils/enums/message.enum';
import { IHomepassOperacion } from '../homepassOperacion';

@Injectable()
export class HomepassOperacion implements IHomepassOperacion {
  /**
   * Metodo que se implementa para utilizar el flujo operacion
   */
  provitionalFunction() {
    return { Response: EmessageMapping.CLIENTE_OPERACION };
  }
}
