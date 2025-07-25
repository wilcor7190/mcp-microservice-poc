/**
 * Clase que se implementa para consumir legados REST
 * @author Juan David Marin
 */
import { Injectable } from '@nestjs/common';
import Logging from '../../../../common/lib/logging';
import { EHttpMethod, IRequestConfigHttp } from '../../../../data-provider/model/http/request-config-http.model';
import { ETaskDesc, Etask } from '../../../../common/utils/enums/task.enum';
import { IMappingLegadosUc } from '../mapping-legaos.resource.uc';
import { Echannel } from '../../../../common/utils/enums/params.enum';
import { IHomePass } from '../../../../data-provider/homePass.provider';
import { ELevelsErrors } from 'src/common/utils/enums/logging.enum';
import GeneralUtil from 'src/common/utils/generalUtil';

@Injectable()
export class MappingLegadosUcimpl implements IMappingLegadosUc {
  private readonly logger = new Logging(MappingLegadosUcimpl.name);

  status: string = '';
  task: string = '';
  description: string = '';
  response: any = '';

  constructor(public readonly _homePassProvider: IHomePass) {}

  /**
   * Metodo que se utiliza para consumir un legado REST
   * @param {any} traceInfo Request a utilizar
   * @param {string} endPoint Legado a consumir
   * @returns una promesa
   */
  async consumerLegadoRest(traceInfo: any, endPoint: string): Promise<any> {
    try {
      this.logger.write('consumerLegadoRest()', Etask.ORCHESTRATOR, ELevelsErrors.INFO, { traceInfo, endPoint });
      let configEndPoint: IRequestConfigHttp = {
        method: EHttpMethod.put,
        url: endPoint,
        data: traceInfo,
      };
      return this._homePassProvider.consumerServiceHomePass(configEndPoint, Etask.SERVICE_HOMEPASS);
    } catch (error) {
      GeneralUtil.assignTaskError(error, Etask.ORCHESTRATOR, ETaskDesc.ORCHESTRATOR);
      throw error;
    }
  }

  /**
   * Metodo que se utiliza para consumir un legado REST que se usa en el JOB
   * @param {any} traceInfo Request a utilizar
   * @param {string} endPoint Legado a consumir
   * @returns una promesa
   */
  async consumerLegadoRestJOB(traceInfo: any, endPoint: string): Promise<any> {
    this.logger.write('consumerLegadoRestJOB()', Etask.ORCHESTRATOR, ELevelsErrors.INFO, { traceInfo, endPoint });
    let configEndPoint: IRequestConfigHttp = {
      method: EHttpMethod.put,
      url: endPoint,
      headers: { channel: Echannel.EC9_B2C },
      data: traceInfo,
    };
    return this._homePassProvider.consumerServiceHomePass(configEndPoint, Etask.SERVICE_HOMEPASS);
  }

  /**
   * Metodo que se utiliza para consumir un legado REST POST
   * @param {any} traceInfo Request a utilizar
   * @param {string} endPoint Legado a consumir
   * @returns una promesa
   */
  async consumerLegadoRestPost(traceInfo: any, endPoint: string): Promise<any> {
    this.logger.write('consumerLegadoRestPost()', Etask.ORCHESTRATOR, ELevelsErrors.INFO, { traceInfo, endPoint });
    let configEndPoint: IRequestConfigHttp = {
      method: EHttpMethod.post,
      url: endPoint,
      headers: { channel: Echannel.EC9_B2C },
      data: traceInfo,
    };
    return this._homePassProvider.consumerServiceHomePass(configEndPoint, Etask.SERVICE_HOMEPASS);
  }
}
