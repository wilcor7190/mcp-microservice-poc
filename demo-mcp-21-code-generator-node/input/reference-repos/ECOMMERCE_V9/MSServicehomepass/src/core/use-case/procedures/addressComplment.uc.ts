/**
 * Clase abstracta utilizada para realizar las respectivas consultas de complementos de direcciones
 * @Author Sebastian Traslaviña
 */
import { Injectable } from '@nestjs/common';
import { GeographicAdDto } from '../../../controller/dto/geographicAddres/geographicAddress.dto';
import { ResponseDB } from 'src/core/entity/response-db.entity';
import { IPoComplemento } from 'src/core/entity/address-complement/po-complementos.entity';

@Injectable()
export abstract class IAddressComplementUc {
  /**
   * Metodo utilizado para consultar al legado posibles complementos de direcciones
   * @param {GeographicAdDto} geographicDto informacion relacionada a la direccion ingresada por el cliente
   * @returns {ResponseService} retorna direccion del cliente estandarizada
   */
  abstract requestAddressComplement(geographicDto: GeographicAdDto): Promise<ResponseDB<IPoComplemento>>;
}
