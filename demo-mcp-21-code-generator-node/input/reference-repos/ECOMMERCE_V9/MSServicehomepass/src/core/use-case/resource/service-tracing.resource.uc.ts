/**
 * Clase abstracta para almacenar las firmas de los metodos que gestionan la trazabilidad
 * @author Juan David Marin
 */
import { Injectable } from '@nestjs/common';
import { IServiceTracing } from '@claro/generic-models-library';
@Injectable()
export abstract class IServiceTracingUc {
  /**
   * Firma del metodo que almacena trazabilidad
   * @param {IServiceTracing} serviceTracing informacion de la trazabilidad a guardar
   */
  abstract createServiceTracing(serviceTracing: IServiceTracing);
}
