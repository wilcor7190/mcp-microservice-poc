/**
 * Clase abstracta con la definición de operaciones a realizar en las colecciones de catalogo
 * @author Santiago Vargas
 */

import { Injectable } from '@nestjs/common';
import { ICatalog, IParents } from '../core/entity/catalog/catalog.entity';

@Injectable()
export abstract class IDataloadProvider {

  /**
   * Operación para consultar los productos de terminales (Features)
   * @returns {ICatalog[]} Arreglo con los productos de terminales
   */  
  abstract findEquipment(): Promise<ICatalog[]>;

  /**
   * Operación para consultar los productos de terminales (Features) filtrados por clasificación
   * @returns {ICatalog[]} Arreglo con los productos de terminales
   */    
  abstract findEquipmentFilter(): Promise<ICatalog[]>;

  /**
   * Operación para consultar los productos de tecnología (Features)
   * @returns {ICatalog[]} Arreglo con los productos de tecnología
   */   
  abstract findTechnology(): Promise<ICatalog[]>;

  /**
   * Operación para consultar los productos de pospago (Features)
   * @returns {ICatalog[]} Arreglo con los productos de pospago
   */   
  abstract findPospago(): Promise<ICatalog[]>;

  /**
   * Operación para consultar los productos de prepago (Features)
   * @returns {ICatalog[]} Arreglo con los productos de prepago
   */   
  abstract findPrepago(): Promise<ICatalog[]>;

  /**
   * Operación para consultar los productos de hogares (Features)
   * @returns {ICatalog[]} Arreglo con los productos de hogares
   */   
  abstract findHomes(): Promise<ICatalog[]>;

  /**
   * Operación para guardar los padres e hijos
   * @param {Object} data Arreglo con la lista de padres e hijos
   * @returns {Boolean} Confirmación de creación de registros
   */  
  abstract saveListParents(data: any): Promise<any>;

  /**
   * Operación para consultar padres e hijos
   * @param {family} family para filtrar productos
   * @returns {Object} Arreglo con la lista de padres e hijos
   */  
  abstract getListParents(family?: string): Promise<IParents[]>;

  /**
   * Operación para consultar y mapear los productos generados por el product-data (Padres-Hijos)
   * @param {ICatalog[]} data Productos por categoría
   * @param {String} family Categoría solicitada
   * @returns {ICatalog[]} Arreglo con los productos de terminales
   */  
  abstract orderListParent(data: ICatalog[], family: string): Promise<ICatalog[]>;  
}
