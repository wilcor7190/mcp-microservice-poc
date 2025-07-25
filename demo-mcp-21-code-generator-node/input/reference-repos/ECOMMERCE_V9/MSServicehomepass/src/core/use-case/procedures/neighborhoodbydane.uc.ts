/**
 * Clase abstracta para realizar las  consultas de barrios por codigo Dane directo a BD
 * @author Juan David Marin
 */
import { Injectable } from '@nestjs/common';
import { NeighborhoodbydaneDTO } from '../../../controller/dto/neighborhoodbydane/neighborhoodbydane.dto';

@Injectable()
export abstract class INeighborhoodbydaneUc {
  /**
   * Firma del metodo que realiza la consulta de un barrio o barrios por el departamento y municipio enviado directamente a BD
   * @param {NeighborhoodbydaneDTO} neighborhoodbydaneDto
   * @returns una promesa
   */
  abstract neighborhoodbydane(neighborhoodbydaneDto: NeighborhoodbydaneDTO): any;
}
