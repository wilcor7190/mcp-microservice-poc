/**
 * Clase que se implementa para realizar las operaciones en BD de PutClientHomePass
 * @author Juan David Marin
 */
import { Injectable } from '@nestjs/common';
import { Etask } from '../../common/utils/enums/task.enum';
import { IPutClientHomePassProvider } from '../PutClientHomePass.provider';
import { IHttpProvider } from '../http.provider';
import { IRequestConfigHttp } from '../model/http/request-config-http.model';
import { ResponseHttp } from '../model/http/response-http.model';

@Injectable()
export class PutClientHomePassProvider implements IPutClientHomePassProvider {
  constructor(private httpProvider: IHttpProvider) { }

  /**
   * Metodo encargado de consumir legado para crear solicitud inspira
   * @param {IRequestConfigHttp} requestConfigHttp Configuracion a utilizar para consumir legado
   * @param {Etask} task tarea que se está ejecutando
   * @returns una promesa
   */
  async consumerServiceAddressCrearSolicitudInspira(requestConfigHttp: IRequestConfigHttp, task: Etask): Promise<ResponseHttp<any>> {
      return this.httpProvider.executeRest(requestConfigHttp, task);
  }
}
