/**
 * Clase abstracta para construcción logica de negocio metodo creación de dataload sales-catalog
 * @author Santiago Vargas
 */

import { Injectable } from '@nestjs/common';
import { ICatalog } from '../../../core/entity/catalog/catalog.entity';

@Injectable()
export abstract class ISalesCatalogUC {

  /**
   * Operación que envía la información para crear el dataload
   * @param {ICatalog[]} parents Productos con sus caracteristicas
   * @param {String} path Endpoint donde se almacenara el dataload
   */          
  abstract dataLoadConfiguration(parents: ICatalog[], path: string);

  /**
   * Operación que envía la información para crear el dataload B2B
   * @param {ICatalog[]} parents Productos con sus caracteristicas
   * @param {String} path Endpoint donde se almacenara el dataload
   */          
  abstract dataLoadConfigurationB2b(parents: ICatalog[], path: string);
}

