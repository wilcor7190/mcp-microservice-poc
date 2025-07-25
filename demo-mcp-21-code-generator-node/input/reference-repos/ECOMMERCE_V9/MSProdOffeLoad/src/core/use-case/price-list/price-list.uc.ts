/**
 * Clase abstracta para construcción logica de negocio metodo creación de dataload price-list
 * @author Santiago Vargas
 */

import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IPriceListUC {

  /**
   * Operación que envía la información para crear el dataload
   * @param {String} category Categoría recibida
   * @param {String} path Endpoint donde se almacenara el dataload
   */      
  abstract dataLoadConfiguration(pathPriceList: string, pathPriceListB2b: string);
}

