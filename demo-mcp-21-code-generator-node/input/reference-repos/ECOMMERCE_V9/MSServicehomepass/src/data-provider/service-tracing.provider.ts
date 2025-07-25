/**
 * Clase abstracta para almacenar las firmas de los metodos que gestionan la trazabilidad en bd
 * @author Juan David Marin
 */
import { Injectable } from '@nestjs/common';
import { IServiceTracing } from '@claro/generic-models-library';
@Injectable()
export abstract class IServiceTracingProvider {
  /**
   * Metodo de trazabilidad de inserción de información.
   * @param serviceTracing
   * @returns Null
   */
  abstract createServiceTracing(serviceTracing: IServiceTracing);
}
