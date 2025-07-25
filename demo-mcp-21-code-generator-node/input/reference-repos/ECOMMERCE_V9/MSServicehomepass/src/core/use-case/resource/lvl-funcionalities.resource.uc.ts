/**
 * Clase abstracta creada para ordenar los mapeos recurrentes utilizados en el ms
 * @author Juan Romero
 */
import { Injectable } from '@nestjs/common';
import { IComplement } from 'src/core/entity/address-complement/geographic-address-list.entity';
import { IPoComplemento } from 'src/core/entity/address-complement/po-complementos.entity';

@Injectable()
export abstract class ILvlFuncionalitiesUc {
  /**
   * Firma del metodo para validar si el objeto está vacío
   * @param {any} data informacion a mapear
   */
  abstract validateData(data: any);

  /**
   * Firma del metodo con logica para mapear la estructura de alternate geographic y complements
   * @param {any} data informacion a mapear
   * @param {boolean} flag bandera de indicacion para mapeo
   */
  abstract mapFilling(data: any, flag: boolean);

  /**
   * Firma del metodo para segmentar la informacion por tipos
   * @param {any} infoToMap informacion a mapear
   * @param {string} component nombre del metodo que consume
   */
  abstract segmentationByType(infoToMap: any, component: string);

  abstract mapAlternateGeographicAddress(poComplements: IPoComplemento[]): IComplement | {};

  abstract mapComplements(poComplements: IPoComplemento[]): IComplement[];
}
