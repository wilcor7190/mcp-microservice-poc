/**
 * Clase abstracta para realizar las respectivas operaciones de consulta de barrios por codigo Dane
 * @author Juan David Marin
 */
import { Injectable } from '@nestjs/common';
import { NeighborhoodbydaneDTO } from '../dto/neighborhoodbydane/neighborhoodbydane.dto';
import { ResponseService } from '../dto/response-service.dto';

@Injectable()
export abstract class INeighborhoodbydane {
  /**
   * Firma del metodo que realiza la consulta de un barrio o barrios por el departamento y municipio enviado Para estandarizar la dirección del cliente en la tienda virtual
   * @param {string} channel
   * @param {string} token
   * @param {NeighborhoodbydaneDTO} neighborhoodbydaneDto
   * @returns una promesa
   */
  abstract consultNeighborhoodbydane(channel: string, token: string, neighborhoodbydaneDto: NeighborhoodbydaneDTO): Promise<ResponseService<any>>; // TIPAR DEL TIPO
}
