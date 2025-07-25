import { getModelToken } from '@nestjs/mongoose';
import { TestingModule, Test } from '@nestjs/testing';
import { Model } from 'mongoose';
import { ProductOfferingProvider } from './product-offering.provider.impl';
import { ProductOfferingModel } from '../model/product-offering/product-offering.model';
import { dataCatalogResponseMock } from '../../mockup/stubs';
import { FamilyParams } from '../../common/utils/enums/params.enum';
import databaseConfig from '../../common/configuration/database.config';

describe('ProductOfferingProvider', () => {
  let productOfferingProvider: ProductOfferingProvider;
  let productOfferingModel: Model<ProductOfferingModel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductOfferingProvider,
        {
          provide: getModelToken(ProductOfferingModel.name, databaseConfig.databaseProductOffering),
          useValue: {
            find: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue(dataCatalogResponseMock),
          },
        },
      ],
    }).compile();

    productOfferingProvider = module.get<ProductOfferingProvider>(
      ProductOfferingProvider,
    );
    productOfferingModel = module.get<Model<ProductOfferingModel>>(
      getModelToken(ProductOfferingModel.name, databaseConfig.databaseProductOffering),
    );
  });

  describe('getData', () => {
    it('should return data', async () => {

      await productOfferingProvider.getData(FamilyParams.equipment);

      expect(productOfferingModel.find).toHaveBeenCalled()
    });
  });
});
