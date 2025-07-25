/**
 * Clase abstracta para construcción logica de negocio orquestación creación de dataload
 * @author Santiago Vargas
 */

import { Injectable } from '@nestjs/common';
import { ICatalog } from '../entity/catalog/catalog.entity';

@Injectable()
export abstract class IDataloadUC {
  /**
   * Operación para consultar los productos de terminales (Features)
   * @returns {ICatalog[]} Arreglo con los productos de terminales
   */
  abstract findEquipmentDataload(): Promise<ICatalog[]>;

  /**
   * Operación para consultar los productos de terminales (Features) filtrados por clasificación
   * @returns {ICatalog[]} Arreglo con los productos de terminales
   */
  abstract findEquipmentFilterDataload(): Promise<ICatalog[]>;

  /**
   * Operación para consultar los productos de tecnología (Features)
   * @returns {ICatalog[]} Arreglo con los productos de tecnología
   */
  abstract findTechnologyDataload(): Promise<ICatalog[]>;

  /**
   * Operación para consultar los productos de pospago (Features)
   * @returns {ICatalog[]} Arreglo con los productos de pospago
   */
  abstract findPospagoDataload(): Promise<ICatalog[]>;

  /**
   * Operación para consultar los productos de prepago (Features)
   * @returns {ICatalog[]} Arreglo con los productos de prepago
   */
  abstract findPrepagoDataload(): Promise<ICatalog[]>;

  /**
   * Operación para consultar los productos de hogares (Features)
   * @returns {ICatalog[]} Arreglo con los productos de hogares
   */
  abstract findHomesDataload(): Promise<ICatalog[]>;

  /**
   * Operación para guardar los padres e hijos
   * @param {Object} data Arreglo con la lista de padres e hijos
   * @returns {Boolean} Confirmación de creación de registros
   */
  abstract saveListParentsDataload(data: any): Promise<any>;

  /**
   * Operación para consultar padres e hijos
   * @returns {Object} Arreglo con la lista de padres e hijos
   */
  abstract getListParentsDataload(): Promise<any>;

  /**
   * Operación para consultar y mapear los productos generados por el product-data (Padres-Hijos)
   * @param {ICatalog[]} data Productos por categoría
   * @param {String} family Categoría solicitada
   * @returns {ICatalog[]} Arreglo con los productos de terminales
   */
  abstract orderListParentDataload(data: ICatalog[], family: string): Promise<ICatalog[]>;
}
