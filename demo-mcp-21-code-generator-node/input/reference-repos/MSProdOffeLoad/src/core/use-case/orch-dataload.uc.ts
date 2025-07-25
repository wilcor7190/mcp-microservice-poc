/**
 * Clase abstracta para construcción logica de negocio orquestación creación de dataload
 * @author Santiago Vargas
 */


import { Injectable } from '@nestjs/common';
import { IDataloadDTO } from '../../controller/dto/dataload/dataload.dto';

@Injectable()
export abstract class IOrchDataloadUC {

  /**
   * Operación para orquestar la creación del dataload
   * @param {IDataloadDTO} req Categoría y dataload solicitados
   */
  abstract orchDataload(req: IDataloadDTO);
}

