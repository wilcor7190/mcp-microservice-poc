/**
 * Clase con operaciones de consumos a product offering
 * @author Daniel C Rubiano R
 */
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Page } from '../../core/entity/prices/product-offering-prices.entity';
import { IProductOfferingProvider } from '../product-offering.provider';
import { ProductOfferingModel } from '../model/product-offering/product-offering.model';
import Logging from '../../common/lib/logging';
import { FamilyParams } from '../../common/utils/enums/params.enum';
import databaseConfig from '../../common/configuration/database.config';
import * as APM from '@claro/general-utils-library';
import { Etask } from '../../common/utils/enums/taks.enum';
import { MappingApiRest } from '../../common/utils/enums/mapping-api-rest';

@Injectable()
export class ProductOfferingProvider implements IProductOfferingProvider {
  private readonly logger = new Logging(ProductOfferingProvider.name);

  constructor(
    @InjectModel(ProductOfferingModel.name, databaseConfig.databaseProductOffering)
    private readonly productOfferingModel: Model<ProductOfferingModel>,
  ) {}

  /**
   * Operación para obtener la data del datacatalog
   * @param {FamilyParams} family
   */
  async getData(family: FamilyParams): Promise<Page[]> {
    let spanIn: any;
    try {
      const filter = {
        'params.type': 'productOfferingPrices',
        'params.family': family,
      };

      spanIn = APM.startSpan(ProductOfferingModel.name, MappingApiRest.DB,'getData',Etask.APM);
      return this.productOfferingModel.find(filter).lean();
    } finally {
      if(spanIn) spanIn.end();
    }
    
  }
}
