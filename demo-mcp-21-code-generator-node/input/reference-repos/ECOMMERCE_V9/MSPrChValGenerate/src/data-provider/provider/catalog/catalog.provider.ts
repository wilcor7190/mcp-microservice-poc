/**
 * clase abstracta donde se define catalog provider
 * * @author Daniel C Rubiano R
 */

import { Injectable } from '@nestjs/common';
import { FamilyParams } from 'src/common/utils/enums/params.enum';

@Injectable()
export abstract class ICatalogProvider {
  abstract deleteAttributes(): Promise<any>;
  abstract saveAttributes(content: any): Promise<any>;
  abstract getDataAttributes(categoria: FamilyParams): Promise<any>;

  abstract deleteExceptionSkus(): Promise<any>;
  abstract saveExceptionSkus(content: any): Promise<any>;
  abstract getDataSkuException(categoria: FamilyParams): Promise<any>;

  abstract deleteTermsConditions(): Promise<any>;
  abstract saveTermsConditions(content: any): Promise<any>;
  abstract getAllTermsConditions(): Promise<any>;

}
