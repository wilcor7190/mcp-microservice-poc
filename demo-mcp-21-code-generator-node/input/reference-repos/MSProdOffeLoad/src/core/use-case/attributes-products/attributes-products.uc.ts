/**
 * Clase abstracta para construcción logica de negocio metodo creación de dataload attributes-products
 * @author Santiago Vargas
 */

import { Injectable } from '@nestjs/common';
import { ECategory, ICatalog } from '../../../core/entity/catalog/catalog.entity';

@Injectable()
export abstract class IAttributesProductsUC {

  /**
   * Operación que envía la información para crear el dataload
   * @param {ICatalog[]} data Productos con sus caracteristicas
   * @param {String} category Categoría recibida
   * @param {String} path Endpoint donde se almacenara el dataload
   */    
  abstract dataLoadConfiguration(data: ICatalog[] | ECategory, pathAttributesProducts: string, pathAttributesProductsB2b: string);
}

