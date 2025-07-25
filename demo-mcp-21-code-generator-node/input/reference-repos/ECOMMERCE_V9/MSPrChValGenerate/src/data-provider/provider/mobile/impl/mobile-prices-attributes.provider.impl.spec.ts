import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { GeneralModel } from 'src/data-provider/model/general/general.model';
import { MobilePricesAttributesProvider } from './mobile-prices-attributes.provider.impl';
import databaseConfig from 'src/common/configuration/database.config';

describe('MobilePricesAttributesProvider', () => {
  let mobilePricesAttributesProvider: MobilePricesAttributesProvider;
  let generalModel: Model<GeneralModel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MobilePricesAttributesProvider,
        {
          provide: getModelToken(GeneralModel.name, databaseConfig.database),
          useValue: {
            insertMany: jest.fn(),
            deleteMany: jest.fn(),
          },
        },
      ],
    }).compile();

    mobilePricesAttributesProvider = module.get<MobilePricesAttributesProvider>(
      MobilePricesAttributesProvider,
    );
    generalModel = module.get<Model<GeneralModel>>(
      getModelToken(GeneralModel.name, databaseConfig.database),
    );
  });

  describe('generalModel', () => {
    it('should insert data for prices', async () => {
      jest.spyOn(generalModel, 'insertMany').mockResolvedValue;

      await mobilePricesAttributesProvider.saveDataMobileGeneralPrices({});

      expect(generalModel.insertMany).toHaveBeenCalled;
    });
    it('should insert data for attribute', async () => {
      jest.spyOn(generalModel, 'insertMany').mockResolvedValue;

      await mobilePricesAttributesProvider.saveDataMobileGeneralAttributes({});

      expect(generalModel.insertMany).toHaveBeenCalled;
    });
  });
});
