/**
 * Clase abstracta para realizar las respectivas operaciones de detalles de direcciones
 * @author Sebastian Traslaviña
 */

import { Injectable } from '@nestjs/common';
import { GeographicDto } from '../dto/geographic/geographic.dto';
import { ResponseService } from '../dto/response-service.dto';

@Injectable()
export abstract class IDetailAddress {
  /**
   * Firma del metodo que realiza la consulta de barrio o barrios por dirección para estandarizar la dirección del cliente en la tienda virtual
   * @param {any} channel canal ingresado por el usuario en el header
   * @param {any} token token ingresado por el usuario en el header
   * @param {GeographicDto} geographicDto Detalles de direccion ingresada por el usuario
   */
  abstract consultDetailsAddres(geographicDto: GeographicDto, channel: any, token: any): Promise<ResponseService<any>>;
}
