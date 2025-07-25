/**
 * Clase con operaciones de consumos a technology
 * @author Daniel C Rubiano R
 */
import { Injectable } from '@nestjs/common';
import { Prices } from '../core/entity/prices/price-list.entity';

@Injectable()
export abstract class ITechnologyProvider {
  /**
   * Operacion para insertar la data de Precios
   * @param data Data para insertar
   */
  abstract insertMany(data: Prices[]): Promise<any>;

  /**
   * Operacion para borrar la data de Precios
   */
  abstract deleteAll(): Promise<any>;
}
