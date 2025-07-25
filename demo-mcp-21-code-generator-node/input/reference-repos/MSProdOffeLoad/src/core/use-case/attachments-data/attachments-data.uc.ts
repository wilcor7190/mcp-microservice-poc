/**
 * Clase abstracta para construcción logica de negocio metodo creación de dataload attachments-data
 * @author Santiago Vargas
 */

import { Injectable } from '@nestjs/common';
import { ECategory } from '../../../core/entity/catalog/catalog.entity';

@Injectable()
export abstract class IAttachmentsDataUC {

  /**
   * Operación que consulta las imagenes y envía la información para crear el dataload
   * @param {ICatalog[]} data Productos con sus caracteristicas
   * @param {String} category Categoría recibida
   * @param {String} path Endpoint donde se almacenara el dataload
   */
  abstract dataLoadConfiguration(data: ECategory, pathAttachmentsData: string, pathAttachmentsDataB2b: string);
}

