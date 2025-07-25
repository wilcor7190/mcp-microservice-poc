/**
 * clase que mapea los datos caracteristicas de mobile
 * @author Oscar Robayo
 */

import { Injectable } from '@nestjs/common';
import { IServiceErrorUc } from '../../resource/service-error.resource.uc';
import { IServiceTracingUc } from '../../resource/service-tracing.resource.uc';
import Logging from 'src/common/lib/logging';
import { ItransformMovilFeatures } from '../transform-movil-features.uc';

@Injectable()
export class TransformMovilFeatures implements ItransformMovilFeatures {
  constructor(
    public readonly _serviceTracing: IServiceTracingUc,
    public readonly _serviceError: IServiceErrorUc,
  ) {}
  private readonly logger = new Logging(TransformMovilFeatures.name);

  /**
   * Metodo que se utiliza para mapear la estructura del objeto, se hace un borrado
   * e insertado del objeto ya paginado
   * @param array
   */

  async transformOriginalData(array: any) {
    return;
  }
}
