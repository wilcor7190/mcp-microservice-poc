import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { GeneralLastPrices } from '../model/last-prices.model';
import { PricesProvider } from './prices.provider.impl';
import { LastPricesDummy } from '../../mockup/data-validate-service';
import { PricesFamily } from '../../common/utils/enums/prices.enum';
import { Model } from 'mongoose';
import databaseConfig from '../../common/configuration/database.config';

describe('PricesProvider', () => {
  let service: PricesProvider;
  let mockGeneralLastPrices: Model<GeneralLastPrices>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PricesProvider,
        {
          provide: getModelToken(GeneralLastPrices.name, databaseConfig.database),
          useValue: {
            findOne: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue({}),
            findOneAndUpdate: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PricesProvider>(PricesProvider);
    mockGeneralLastPrices = module.get<Model<GeneralLastPrices>>(
      getModelToken(GeneralLastPrices.name, databaseConfig.database),
    );
  });
  it('saveDataLastPrices', async () => {
    let filterFind = 'PO_Equ70048210';
    await service.saveDataLastPrices(filterFind, LastPricesDummy);
    expect(mockGeneralLastPrices.findOneAndUpdate).toHaveBeenCalled();
  });
  it('findLastPrices', async () => {
    let filterFind = 'PO_Equ70048210';
    await service.findLastPrices(filterFind, PricesFamily.terminalesLibres);
    expect(mockGeneralLastPrices.findOne).toHaveBeenCalled();
  });
});
