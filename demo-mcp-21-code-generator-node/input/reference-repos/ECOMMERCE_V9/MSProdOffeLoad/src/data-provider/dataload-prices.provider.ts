/**
 * Clase abstracta con la definición de operaciones a realizar en las colecciones de catalogo (Precios)
 * @author Santiago Vargas
 */

import { Injectable } from '@nestjs/common';
import { IDisponibility } from '../core/entity/catalog/disponibility.entity';
import { IPriceList } from '../core/entity/catalog/price-list.entity';

@Injectable()
export abstract class IDataloadProviderPrices {

  /**
   * Operación para consultar lista de precios por partNumber
   * @param {String} category Categoría solicitada
   * @param {String} partNumber PartNumber a consultar
   * @returns {IPriceList[]} Lista de precios por partnumber
   */  
  abstract getPrices(category: string, partNumber: string): Promise<IPriceList[]>;

  /**
   * Operación para consultar la disponibilidad de los productos
   * @returns {IDisponibility[]} Arreglo con la disponibilidad de los productos
   */    
  abstract findDisponibility(): Promise<IDisponibility[]>;  
}
