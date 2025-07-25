/**
 * Clase con operaciones de consumos a equipment
 * @author Daniel C Rubiano R
 */
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IEquipmentProvider } from '../equipment.provider';
import { EquipmentModel } from '../model/equipment.model';
import { Prices } from '../../core/entity/prices/price-list.entity';
import databaseConfig from '../../common/configuration/database.config';
import { MappingApiRest } from '../../common/utils/enums/mapping-api-rest';
import { Etask } from '../../common/utils/enums/taks.enum';
import * as APM from '@claro/general-utils-library';

@Injectable()
export class EquipmentProvider implements IEquipmentProvider {
  constructor(
    @InjectModel(EquipmentModel.name, databaseConfig.database)
    private readonly equipmentModel: Model<EquipmentModel>,
  ) {}

  async insertMany(data: Prices[]): Promise<any> {
    let spanIn: any;
    try {
      spanIn = APM.startSpan(EquipmentModel.name, MappingApiRest.DB,'insertMany',Etask.APM);
      return this.equipmentModel.insertMany(data);
    } finally {
      if(spanIn) spanIn.end();      
    }
  }

  async deleteAll(): Promise<any> {
    let spanIn: any;
    try {
      spanIn = APM.startSpan(EquipmentModel.name, MappingApiRest.DB,'deleteAll',Etask.APM);
      return this.equipmentModel.deleteMany({});
    } finally {
      if(spanIn) spanIn.end();
    }
  }
}
