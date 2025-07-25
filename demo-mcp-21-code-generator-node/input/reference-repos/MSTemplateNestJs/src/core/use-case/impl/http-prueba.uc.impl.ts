/**
 * Clase con la funcionalidad de las peticiones http de ejemplo
 * @author Fredy Santiago Martinez
 */
import { Injectable } from '@nestjs/common';
import { IHttpPruebaProvider } from 'src/data-provider/http-prueba.provider';
import { IHttpPruebaUc } from '../http-prueba.uc';

@Injectable()
export class HttpPruebaUcimpl implements IHttpPruebaUc {
  constructor(public readonly _httpPruebaProvider: IHttpPruebaProvider) {}

  /**
    * Funcion para consultar por el Identificador
    * @param {string} _id Identificador
    */
  async getById(_id: string): Promise<any> {
    await this._httpPruebaProvider.getById(_id);
  }

  /**
    * Funcion para consultar segun la configuracion
    * @param {Number} page Número de página a consultar
    * @param {Number} limit Cantidad de registros por página
    */
  async getAll(page: number, limit: number): Promise<any> {
    await this._httpPruebaProvider.getAll(page, limit);
  }
}
