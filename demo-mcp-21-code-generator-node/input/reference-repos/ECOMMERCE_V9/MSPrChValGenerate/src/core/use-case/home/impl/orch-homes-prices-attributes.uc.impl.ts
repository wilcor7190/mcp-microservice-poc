/**
 * Clase Orquestrador de precios hogar
 * @author Oscar Robayo
 */

import { Injectable } from '@nestjs/common';
import Logging from 'src/common/lib/logging';
import { IParamProvider } from 'src/data-provider/param.provider';
import { IFileManagerProvider } from 'src/data-provider/provider/downloadFile/file-manager.provider';
import { ISftpManagerProvider } from 'src/data-provider/provider/downloadFile/sftp-manager.provider';
import { IHomePricesAttributesProvider } from 'src/data-provider/provider/home/homesPricesAttributes.provider';
import { IServiceErrorUc } from '../../resource/service-error.resource.uc';
import { IServiceTracingUc } from '../../resource/service-tracing.resource.uc';
import { IHomesPricesAttributesUc } from '../orch-homes-prices-attributes.uc';

@Injectable()
export class HomesPricesAttributesUc implements IHomesPricesAttributesUc {
  constructor(
    private readonly _sftpManagerProvider: ISftpManagerProvider,
    private readonly _fileManagerProvider: IFileManagerProvider,
    private readonly _parmProvider: IParamProvider,
    public readonly _serviceTracing: IServiceTracingUc,
    public readonly _serviceError: IServiceErrorUc,
    private readonly _homePricesAttributesProvider: IHomePricesAttributesProvider,
  ) {}

  private readonly logger = new Logging(HomesPricesAttributesUc.name);

  /**
   * Orquestador de la clase para el flujo de hogares, consulta e inserta en las colecciones , attributos y precios
   */

  async getOrchHomes(): Promise<any> {
    await this.getHomeAttributes();
    await this.getHomePrices();
  }
  /**
   * va a un sftp a obtener el archivo de attributos y hace un volcado
   * @returns {Boolean} para ver si se hizo de manera correcta
   */
  async getHomeAttributes(): Promise<any> {
    return;
  }
  /**
   * va a un sftp a obtener el archivo de precios y hace un volcado
   * @returns {Boolean} para ver si se hizo de manera correcta
   */
  async getHomePrices(): Promise<any> {
    return;
  }
}
