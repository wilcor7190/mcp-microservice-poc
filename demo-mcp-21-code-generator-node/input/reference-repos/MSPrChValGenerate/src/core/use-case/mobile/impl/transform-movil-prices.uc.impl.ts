/**
 * clase mapea los datos de prices movil
 * @author Edwin Avila
 */

import { Injectable } from '@nestjs/common';
import { IServiceErrorUc } from '../../resource/service-error.resource.uc';
import { IServiceTracingUc } from '../../resource/service-tracing.resource.uc';
import Logging from 'src/common/lib/logging';
import { ItransformMovilPrices } from '../transform-movil-prices.uc';

@Injectable()
export class TransformMovilPricesImpl implements ItransformMovilPrices {
  constructor(
    public readonly _serviceTracing: IServiceTracingUc,
    public readonly _serviceError: IServiceErrorUc,
  ) {}

  private readonly logger = new Logging(TransformMovilPricesImpl.name);
  /**
   * Metodo que se utiliza para transformar la consulta y convertirla en objeto con la estructura para insertar
   * en el productOfferingResponse en la parte de Prices , se hace una inserccion paginada
   * @param array
   */

  async transformOriginalData(array: any) {
    return;
  }
}
