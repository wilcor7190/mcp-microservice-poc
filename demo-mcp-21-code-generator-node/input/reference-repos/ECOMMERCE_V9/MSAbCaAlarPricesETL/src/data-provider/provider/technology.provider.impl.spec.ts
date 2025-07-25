import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { equipmentModelMock } from '../../mockup/stubs';
import { Prices } from '../../core/entity/prices/price-list.entity';
import { TechnologyProvider } from './technology.provider.impl';
import { TechnologyModel } from '../model/technology.model';
import databaseConfig from '../../common/configuration/database.config';

describe('TechnologyProvider', () => {
  let technologyProvider: TechnologyProvider;
  let technologyModel: Model<TechnologyModel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TechnologyProvider,
        {
          provide: getModelToken(TechnologyModel.name, databaseConfig.database),
          useValue: {
            insertMany: jest.fn(),
            deleteMany: jest.fn(),
          },
        },
      ],
    }).compile();

    technologyProvider = module.get<TechnologyProvider>(TechnologyProvider);
    technologyModel = module.get<Model<TechnologyModel>>(
      getModelToken(TechnologyModel.name, databaseConfig.database),
    );
  });

  describe('insertMany', () => {
    it('should insert data', async () => {
      const testData: Prices[] = [equipmentModelMock];

      await technologyProvider.insertMany(testData);

      expect(technologyModel.insertMany).toHaveBeenCalledWith(testData);
    });
  });

  describe('deleteAll', () => {
    it('should delete all data', async () => {
      jest.spyOn(technologyModel, 'deleteMany').mockResolvedValue

      await technologyProvider.deleteAll();

      expect(technologyModel.deleteMany).toHaveBeenCalledWith({});
    });
  });
});
