/**
 * Clase que se implementa para realizar las operaciones en BD de Homepass
 * @author Juan David Marin
 */
import { Injectable } from '@nestjs/common';
import { Etask } from '../../common/utils/enums/task.enum';
import { IHomePass } from '../homePass.provider';
import { IHttpProvider } from '../http.provider';
import { IRequestConfigHttp } from '../model/http/request-config-http.model';
import { ResponseHttp } from '../model/http/response-http.model';

@Injectable()
export class HomePassProviderimpl implements IHomePass {
  constructor(private httpProvider: IHttpProvider) { }

  /**
   * Metodo encargado de consumir legado para Homepass
   * @param {IRequestConfigHttp} requestConfigHttp configuracion a utilizar para consumir el legadoS
   * @param {Etask} task Tarea que se está ejecutando
   * @returns una promesa
   */
  async consumerServiceHomePass(requestConfigHttp: IRequestConfigHttp, task: Etask): Promise<ResponseHttp<any>> {
    let spanIn;
    try {
      return this.httpProvider.executeRest(requestConfigHttp, task);
    } finally {
      if (spanIn) spanIn.end();
    }
  }
}
