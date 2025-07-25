/**
 * Clase abstracta que almacena las firmas de los metodos encargados de realizar las operaciones en BD de PutClientHomePass
 * @author Juan David Marin
 */
import { Injectable } from '@nestjs/common';
import { IRequestConfigHttp } from './model/http/request-config-http.model';
import { Etask } from '../common/utils/enums/task.enum';
import { ResponseHttp } from './model/http/response-http.model';

@Injectable()
export abstract class IPutClientHomePassProvider {
  /**
   * Firma de metodo encargado de consumir legado para crear solicitud inspira
   * @param {IRequestConfigHttp} requestConfigHttp Configuracion a utilizar para consumir legado
   * @param {Etask} task tarea que se está ejecutando
   */
  abstract consumerServiceAddressCrearSolicitudInspira(requestConfigHttp: IRequestConfigHttp, task: Etask): Promise<ResponseHttp>;
}
