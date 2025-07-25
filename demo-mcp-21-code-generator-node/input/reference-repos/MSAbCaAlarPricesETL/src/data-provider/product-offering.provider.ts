/**
 * Clase con operaciones de consumos a product offering
 * @author Daniel C Rubiano R
 */
import { Injectable } from '@nestjs/common';
import { Page } from '../core/entity/prices/product-offering-prices.entity';
import { FamilyParams } from '../common/utils/enums/params.enum';

@Injectable()
export abstract class IProductOfferingProvider {
  /**
   * Operacion para traer la data del servicio ProductOffering
   * @param {FamilyParams} family Filtro para hacer el find de la data
   */
  abstract getData(family: FamilyParams): Promise<Page[]>;
}
