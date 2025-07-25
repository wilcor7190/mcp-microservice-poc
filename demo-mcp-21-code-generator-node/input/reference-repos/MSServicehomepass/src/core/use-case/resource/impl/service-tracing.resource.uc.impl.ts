/**
 * Clase que se implementa para almacenar las firmas de los metodos que gestionan la trazabilidad
 * @author Juan David Marin
 */
import { Injectable } from '@nestjs/common';
import { IServiceTracing } from '@claro/generic-models-library';
import { IServiceTracingProvider } from '../../../../data-provider/service-tracing.provider';
import { IServiceTracingUc } from '../service-tracing.resource.uc';

@Injectable()
export class ServiceTracingUcimpl implements IServiceTracingUc {
  constructor(private readonly _serviceTracingProvider: IServiceTracingProvider) {}

  /**
   * Metodo que almacena trazabilidad
   * @param serviceTracing informacion de la trazabilidad a guardar
   * @returns una promesa
   */
  async createServiceTracing(serviceTracing: IServiceTracing) {
    this._serviceTracingProvider.createServiceTracing(serviceTracing);
  }
}
