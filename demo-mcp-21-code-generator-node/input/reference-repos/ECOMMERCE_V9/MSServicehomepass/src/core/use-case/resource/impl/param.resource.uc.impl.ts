/**
 * Clase para la configuración de parametros generales
 * @author Santiago Martinez
 */

import { Etask } from '../../../../common/utils/enums/task.enum';
import { Injectable } from '@nestjs/common';
import { IParam } from '@claro/generic-models-library';
import { IParamProvider } from '../../../../data-provider/param.provider';
import { IParamUc } from '../param.resource.uc';
import { IServiceErrorUc } from '../service-error.resource.uc';
import Logging from '../../../../common/lib/logging';
import { ELevelsErrors } from 'src/common/utils/enums/logging.enum';

@Injectable()
export class ParamUcimpl implements IParamUc {
  public static params: IParam[];
  private readonly logger = new Logging(ParamUcimpl.name);

  constructor(
    public readonly _paramProvider: IParamProvider,
    public readonly _serviceError: IServiceErrorUc,
  ) {}

  public static get getMessages(): IParam[] {
    return ParamUcimpl.params;
  }

  async onModuleInit() {
    await this.loadParams();
  }
  /**
   * Función para cargar los parametros en las variables estaticas
   */
  async loadParams(): Promise<any> {
    let param: IParam[] = [];
    try {
      param = await this._paramProvider.getParams(1, 100, {});
    } catch (error) {
      this.logger.write(`Error cargando parámetros`, Etask.LOAD_PARAM, ELevelsErrors.ERROR, null, error);
    } finally {
      // Actualizar variable estática
      ParamUcimpl.params = param;
    }
  }
}
