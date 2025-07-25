/**
 * Clase con operaciones de consumos a equipment
 * @author Daniel C Rubiano R
 */
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Prices } from '../../core/entity/prices/price-list.entity';
import { ITechnologyProvider } from '../technology.provider';
import { TechnologyModel } from '../model/technology.model';
import databaseConfig from '../../common/configuration/database.config';
import * as APM from '@claro/general-utils-library';
import { MappingApiRest } from '../../common/utils/enums/mapping-api-rest';
import { Etask } from '../../common/utils/enums/taks.enum';

@Injectable()
export class TechnologyProvider implements ITechnologyProvider {
  constructor(
    @InjectModel(TechnologyModel.name, databaseConfig.database)
    private readonly technologyModel: Model<TechnologyModel>,
  ) {}

  async insertMany(data: Prices[]): Promise<any> {
    let spanIn: any;
    try {
      spanIn = APM.startSpan(TechnologyModel.name, MappingApiRest.DB,'insertMany',Etask.APM);
      return this.technologyModel.insertMany(data);
    } finally {
      if(spanIn) spanIn.end();
    }
  }

  async deleteAll(): Promise<any> {
    let spanIn: any;
    try {
      spanIn = APM.startSpan(TechnologyModel.name, MappingApiRest.DB,'deleteAll',Etask.APM);
      return this.technologyModel.deleteMany({});
    } finally {
      if(spanIn) spanIn.end();
    }
  }
}
