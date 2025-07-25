/**
 * Clase para realizar las respectivas operaciones de los ms
 * @author Oscar Avila
 */
import { Injectable } from '@nestjs/common';
import { EmessageMapping } from 'src/common/utils/enums/message.enum';
import { ResponseService } from 'src/controller/dto/response-service.dto';
import { IHttpPruebaUc } from 'src/core/use-case/http-prueba.uc';
import { IHttpPruebaService } from '../http-prueba.service';

@Injectable()
export class HttpPruebaService implements IHttpPruebaService {
  constructor(private readonly _httpPruebaUc: IHttpPruebaUc) {}

  /**
    * consulta por identificador
    * @param {String} _id identificador 
    * @returns {ResponseService} Lógica del caso de uso en el response de la operación
    */
  async getById(_id: string): Promise<ResponseService<any>> {
    const result = await this._httpPruebaUc.getById(_id);
    return new ResponseService(
        true,
        EmessageMapping.DEFAULT,
        200,
        result,
    );
  }

  /**
    * consulta segun la configuracion
    * @param {Number} page Número de página a consultar
    * @param {Number} limit Cantidad de registros por página
    * @returns {ResponseService} Lógica del caso de uso en el response de la operación
    */
  async getAll(page: number, limit: number): Promise<ResponseService<any>> {
    const result = await this._httpPruebaUc.getAll(page, limit);
    return new ResponseService(
      true,
      result
        ? EmessageMapping.DEFAULT
        : EmessageMapping.DEFAULT_ERROR,
      200,
      result,
    );
  }

}
