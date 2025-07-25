/**
 * Clase abstracta para realizar las respectivas operaciones de creación de dataloads
 * @author Santiago Vargas
 */

import { Injectable } from '@nestjs/common';
import { ResponseService } from '../dto/response-service.dto';
import { IDataloadDTO } from '../dto/dataload/dataload.dto';

@Injectable()
export abstract class IDataloadService {

  /**
   * Creación de dataload
   * @param {IDataloadDTO} req Categoria y dataload a generar
   */
  abstract generateDataloadManual(req: IDataloadDTO): Promise<ResponseService>;
}