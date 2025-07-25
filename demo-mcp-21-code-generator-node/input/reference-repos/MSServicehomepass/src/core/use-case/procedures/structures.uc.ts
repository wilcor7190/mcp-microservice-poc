/**
 * Clase abstracta para realizar las respectivas consultas de estructuras de direcciones a BD
 * @author Juan David Marin
 */
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IOrchStructuresUc {
  /**
   * Firma del metodo que realiza la consulta a BD del filtro de las estructuras, por los tipos de dirección enviada. para estandarizar la dirección del cliente en la tienda virtual
   * @param {any} data informacion de direccion
   */
  abstract initialFunction(data: any): any;
}
