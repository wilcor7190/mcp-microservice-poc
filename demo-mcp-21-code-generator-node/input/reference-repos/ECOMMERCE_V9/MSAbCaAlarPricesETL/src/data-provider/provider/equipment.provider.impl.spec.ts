import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { equipmentModelMock } from '../../mockup/stubs';
import { EquipmentProvider } from './equipment.provider.impl';
import { Prices } from '../../core/entity/prices/price-list.entity';
import { EquipmentModel } from '../model/equipment.model';
import databaseConfig from '../../common/configuration/database.config';

describe('EquipmentProvider', () => {
  let equipmentProvider: EquipmentProvider;
  let equipmentModel: Model<EquipmentModel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EquipmentProvider,
        {
          provide: getModelToken(EquipmentModel.name, databaseConfig.database),
          useValue: {
            insertMany: jest.fn(),
            deleteMany: jest.fn(),
          },
        },
      ],
    }).compile();

    equipmentProvider = module.get<EquipmentProvider>(EquipmentProvider);
    equipmentModel = module.get<Model<EquipmentModel>>(
      getModelToken(EquipmentModel.name, databaseConfig.database),
    );
  });

  describe('insertMany', () => {
    it('should insert data', async () => {
      const testData: Prices[] = [equipmentModelMock];

      await equipmentProvider.insertMany(testData);

      expect(equipmentModel.insertMany).toHaveBeenCalledWith(testData);
    });
  });

  describe('deleteAll', () => {
    it('should delete all data', async () => {
      jest.spyOn(equipmentModel, 'deleteMany').mockResolvedValue;

      await equipmentProvider.deleteAll();

      expect(equipmentModel.deleteMany).toHaveBeenCalledWith({});
    });
  });
});
