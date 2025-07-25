/**
 * Clase abstracta para realizar las respectivas operaciones de estructuras de direcciones
 * @author Juan David Marin
 */
import { Injectable } from '@nestjs/common';
import { StructuresDTO } from '../dto/structures/structures.dto';

@Injectable()
export abstract class IStructuresService {
  /**
   * Firma del metodo que realiza la consulta del filtro de las estructuras, por los tipos de dirección enviada. para estandarizar la dirección del cliente en la tienda virtual
   * @param {string} channel canal ingresado por el usuario en el header
   * @param {StructuresDTO} structuresDTO informacion de direccion
   */
  abstract consultStructures(structuresDTO: StructuresDTO, channel: string): any;
}
