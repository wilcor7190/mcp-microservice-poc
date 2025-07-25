/**
 * Clase abstracta que almacena las firmas de los metodos encargados de realizar las operaciones en BD de Homepass
 * @author Juan David Marin
 */
import { Injectable } from '@nestjs/common';
import { IRequestConfigHttp } from './model/http/request-config-http.model';
import { Etask } from '../common/utils/enums/task.enum';
import { ResponseHttp } from './model/http/response-http.model';
@Injectable()
export abstract class IHomePass {
  /**
   * Firma de metodo encargado de consumir legado para Homepass
   * @param {IRequestConfigHttp} requestConfigHttp configuracion a utilizar para consumir el legadoS
   * @param {Etask} task Tarea que se está ejecutando
   */
  abstract consumerServiceHomePass(requestConfigHttp: IRequestConfigHttp, task: Etask): Promise<ResponseHttp>;
}
