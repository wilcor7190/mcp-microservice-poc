import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { GeneralModel } from 'src/data-provider/model/general/general.model';
import { MobilePricesAttributesProvider } from './mobile-prices-attributes.provider.impl';
import databaseConfig from 'src/common/configuration/database.config';
import { MovilFeaturesProvider } from './movil-features.provider.impl';
import { IMovilFeaturesDTO } from 'src/controller/dto/general/movil/movideFeatures.dto';
import { IMovilPricesDTO } from 'src/controller/dto/general/movil/movidePrices.dto';

describe('MobilePricesAttributesProvider', () => {
  let movilFeaturesProvider: MovilFeaturesProvider;
  let generalModel: Model<GeneralModel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovilFeaturesProvider,
        {
          provide: getModelToken(GeneralModel.name, databaseConfig.database),
          useValue: {
            insertMany: jest.fn(),
            deleteMany: jest.fn(),
          },
        },
      ],
    }).compile();

    movilFeaturesProvider = module.get<MovilFeaturesProvider>(
        MovilFeaturesProvider,
    );
    generalModel = module.get<Model<GeneralModel>>(
      getModelToken(GeneralModel.name, databaseConfig.database),
    );
  });

  describe('generalModel', () => {
    it('should insert data for feature', async () => {
      jest.spyOn(generalModel, 'insertMany').mockResolvedValue;

      await movilFeaturesProvider.saveTransformDataMovilFeature({} as IMovilFeaturesDTO);

      expect(generalModel.insertMany).toHaveBeenCalled;
    });
    it('should insert data for prices', async () => {
      jest.spyOn(generalModel, 'insertMany').mockResolvedValue;

      await movilFeaturesProvider.saveTransformDataMovilPrices({} as IMovilPricesDTO);

      expect(generalModel.insertMany).toHaveBeenCalled;
    });
    it('should data data for feature', async () => {
      jest.spyOn(generalModel, 'deleteMany').mockResolvedValue;

      await movilFeaturesProvider.deleteDataMovilFeature();

      expect(generalModel.deleteMany).toHaveBeenCalled;
    });
    it('should data data for prices', async () => {
      jest.spyOn(generalModel, 'deleteMany').mockResolvedValue;

      await movilFeaturesProvider.deleteDataMovilPrices();

      expect(generalModel.deleteMany).toHaveBeenCalled;
    });

  });
});
