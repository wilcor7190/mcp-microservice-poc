/**
 * Clase abstracta para construcción logica de negocio orquestación creación de dataload
 * @author Santiago Vargas
 */

import { Injectable } from '@nestjs/common';
import { IDataloadDTO } from '../../controller/dto/dataload/dataload.dto';
import { ECategory, ICatalog } from '../entity/catalog/catalog.entity';

@Injectable()
export abstract class ISelectDataloadUC {
  /**
   * Operación para orquestar la creación del dataload
   * @param {ICatalog} data Productos por categoría
   * @param {IDataloadDTO} req Categoria y dataload
   */
  abstract selectDataLoad(
    data: ICatalog[] | ECategory,
    req: IDataloadDTO,
  ): Promise<void>;
}
