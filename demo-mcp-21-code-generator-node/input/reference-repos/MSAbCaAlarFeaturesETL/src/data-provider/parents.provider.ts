/**
 * Clase abstracta con la definición de operaciones a realizar en las colecciones de catalogo
 * @author Santiago Vargas
 */

import { Injectable } from '@nestjs/common';
import { IParents } from '../core/entity/categories/category.entity';

@Injectable()
export abstract class IParentsProvider {

 /**
   * Operación para guardar los padres e hijos
   * @param {Object} data Arreglo con la lista de padres e hijos
   * @returns {Boolean} Confirmación de creación de registros
   */  
 abstract saveListParents(data: IParents[]): Promise<any>;

 /**
  * Operación para guardar los padres e hijos
  * @param {Object} data Arreglo con la lista de padres
  */
 abstract saveListParentsCollection(data: any): Promise<any>;

 /**
  * Operación para buscar los padres en base de datos
  */
 abstract findParentsCollection(): Promise<any>;

  /**
   * Operacion para limpiar o borrar las colecciones
   * @returns {Boolean} Confirmación de la eliminación
   */  
 abstract deleteCollection(): Promise<any>;

}