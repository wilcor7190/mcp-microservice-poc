/**
 * Clase con operaciones de consumos a legados de tipo SOAP y Rest
 * @author Alexis Sterzer
 */
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IPricesProvider } from '../prices.provider';
import { GeneralLastPrices } from '../model/last-prices.model';
import { LastPrices } from '../../core/entity/prices/product-offering-prices.entity';
import { PricesFamily } from '../../common/utils/enums/prices.enum';
import databaseConfig from '../../common/configuration/database.config';
import { MappingApiRest } from '../../common/utils/enums/mapping-api-rest';
import { Etask } from '../../common/utils/enums/taks.enum';
import * as APM from '@claro/general-utils-library';

@Injectable()
export class PricesProvider implements IPricesProvider {
  constructor(
    @InjectModel(GeneralLastPrices.name, databaseConfig.database)
    private readonly generalLastPrices: Model<GeneralLastPrices>,
  ) {}

  /**
   *
   * @param filter Filtro para realizar la consulta a base de datos
   * @returns Retorna la data consultada
   */
  async findLastPrices(
    filter: string,
    family: PricesFamily,
  ): Promise<LastPrices> {
    let spanIn: any;
    try {
      const filterFind = {
        CatentryPartNumber: `${filter}`,
        family: `${family}`,
      };

      spanIn = APM.startSpan(GeneralLastPrices.name, MappingApiRest.DB,'findLastPrices',Etask.APM);
      return this.generalLastPrices.findOne(filterFind).lean();
    } finally {
      if(spanIn) spanIn.end();
    }

  }

  /**
   * Operacion para actualizar el contenido o la data en la colección
   * @param content Contenido o data para insertar en la colección
   * @param nameCollection Nombre de la coleccion
   */
  async saveDataLastPrices(
    filter: string,
    content: LastPrices,
  ): Promise<LastPrices> {
    let spanIn: any;
    try {
      const filterFind = {
        CatentryPartNumber: `${filter}`,
        family: `${content.family}`,
      };

      spanIn = APM.startSpan(GeneralLastPrices.name, MappingApiRest.DB,'saveDataLastPrices',Etask.APM);
  
      return this.generalLastPrices.findOneAndUpdate(
        filterFind,
        {
          $set: {
            extendedSitesCatalogAssetStoreList:
              content.extendedSitesCatalogAssetStoreList,
            extendedSitesCatalogAssetStore:
              content.extendedSitesCatalogAssetStore,
          },
        },
        { upsert: true },
      );
    } finally {
      if(spanIn) spanIn.end();
    }
  }
}
