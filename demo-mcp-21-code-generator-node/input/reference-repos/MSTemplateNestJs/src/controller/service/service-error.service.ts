/**
 * Clase abstracta para el manejo de errores en el ms
 * @author Fredy Santiago Martinez
 */

import { Injectable } from '@nestjs/common';
import { ResponseService } from '../dto/response-service.dto';

@Injectable()
export abstract class IServiceErrorService {

  /**
  * Consulta información de errores
  * @param {Number} page Número de página a consultar
  * @param {Number} limit Cantidad de registros por página
  * @param {Object} filter arreglo de campos a consultar
  */
  abstract getServiceErrors(page: number, limit: number, filter: any): Promise<ResponseService>;
}
