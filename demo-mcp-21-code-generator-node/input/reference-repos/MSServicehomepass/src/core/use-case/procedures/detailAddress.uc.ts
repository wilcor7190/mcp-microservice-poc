/**
 * Clase abstracta para realizar las respectivas consultas de informacion de detalles de direcciones
 * @author Sebastian Traslaviña
 */
import { Injectable } from '@nestjs/common';
import { GeographicDto } from '../../../controller/dto/geographic/geographic.dto';

@Injectable()
export abstract class IDetailAddressUc {
  /**
   * Firma del metodo que realiza la consulta de barrio o barrios al legado
   * @param {GeographicDto} geographicDto Detalles de direccion ingresada por el usuario
   */
  abstract detailAddress(geographicDto: GeographicDto): any;
}
