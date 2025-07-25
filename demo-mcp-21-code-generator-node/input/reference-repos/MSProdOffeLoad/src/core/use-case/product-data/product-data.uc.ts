/**
 * Clase abstracta para construcción logica de negocio metodo creación de dataload product-data
 * @author Santiago Vargas
 */

import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IProductDataUC {

  /**
   * Operación que envía la información para crear el dataload
   * @param {} data Productos con sus caracteristicas
   * @param {String} category Categoría recibida
   * @param {String} path Endpoint donde se almacenara el dataload
   * @param {String} pathSalesCatalog Endpoint donde se almacenera el dataload
   * @param {String} pathSalesCatalogB2b Endpoint donde se almacenera el dataload de B2B
   */        
  abstract dataLoadConfiguration(data: any, pathProductData: string, pathSalesCatalog: string, pathProductDataB2b: string, pathSalesCatalogB2b: string);
}

