/**
 * clase que inserta en productOffering prices prepago y pospago
 * @author Oscar Robayo
 */

import { Injectable } from '@nestjs/common';
import { IParamProvider } from 'src/data-provider/param.provider';
import { IFileManagerProvider } from 'src/data-provider/provider/downloadFile/file-manager.provider';
import { ISftpManagerProvider } from 'src/data-provider/provider/downloadFile/sftp-manager.provider';
import { IMobilePricesAttributesProvider } from 'src/data-provider/provider/mobile/mobile-prices-attributes.provider';
import { IPriceProvider } from 'src/data-provider/provider/prices/price.provider';
import { IServiceErrorUc } from '../../resource/service-error.resource.uc';
import { IServiceTracingUc } from '../../resource/service-tracing.resource.uc';
import { IMobilePricesAttributesUc } from '../orch-mobile-prices-attributes.uc';

@Injectable()
export class MobilePricesAttributesUc implements IMobilePricesAttributesUc {
  constructor(
    private readonly _sftpManagerProvider: ISftpManagerProvider,
    private readonly _fileManagerProvider: IFileManagerProvider,
    private readonly _parmProvider: IParamProvider,
    public readonly _serviceTracing: IServiceTracingUc,
    public readonly _serviceError: IServiceErrorUc,
    private readonly _mobilePricesAttributesProvider: IMobilePricesAttributesProvider,
    private readonly _priceProvider: IPriceProvider,
  ) {}

  /**
   * metodo que sincroniza la carga de attributos y precios
   */
  async getOrchMobile(): Promise<any> {
    await this.getMovileAttributes();
    await this.getMobilePrices();
  }
  /**
   * Metodo que se encarga de descargar los archivos de un sftp  borrar la coleccion e insertado en productOfferingPrices
   * @returns {Boolean} de insertado fallido
   */
  async getMovileAttributes(): Promise<any> {
    return;
  }

  /**
   * Metodo que se encarga de obteer los archivos del sftp para vaciarlo en sus respectivas colecciones
   * se hace el insertado de precios en el productOfferingPrices ya paginado de acuerdo a la configuracion
   * @returns {Boolean} de si se inserto adecuadamente
   */
  async getMobilePrices(): Promise<any> {
    return;
  }
}
