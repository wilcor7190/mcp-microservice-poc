/**
 * Clase abstacta para almacenar las firmas de los metodos relacionadas a CusRequestHomePass
 * @author Juan David Marin
 */
import { Injectable } from '@nestjs/common';
import { ICusRequestHomePass } from '../core/entity/cusRequestHomePass/cusRequestHomePass.entity';

@Injectable()
export abstract class ICusRequestHomePassProvider {
  /**
   * Firma del metodo para actualizar un registro en CusRequestHomePass
   * @param {any} filter Filtro a aplicar en la busqueda
   * @param {any} data Data a registrar
   */
  abstract updateCusRequestHomePass(filter: any, data: any): Promise<ICusRequestHomePass>;

  /**
   * Firma del metodo para obtener un registo en CusRequestHomePass
   * @param {any} filter Filtro a aplicar en la busqueda
   */
  abstract getCusRequestHomePass(filter: any): Promise<any>;

  /**
   * Firma del metodo para crear un registro en CusRequestHomePass
   * @param {any} CusRequestHomePass Data a registrar
   * @param {any} user Data a registrar
   * @param {String} codigoDane Data a registrar
   * @param {any} idCaseTcrm Data a registrar
   * @param {any} booleansData Data a registrar
   * @param {any} bodyRequest Data a registrar
   * @param {any} idAddress Data a registrar
   */
  abstract createCusRequestHomePassGeneral(
    CusRequestHomePass: any,
    user: string,
    message: any,
    codigoDane: any,
    idObj: any,
    booleansData: any,
    bodyRequest: any,
  ): Promise<any>;
}
