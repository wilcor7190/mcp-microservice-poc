import { FamilyParams } from '../../../common/utils/enums/params.enum';
import { IEquipmentProvider } from '../../../data-provider/equipment.provider';
import { IPricesProvider } from '../../../data-provider/prices.provider';
import { IProductOfferingProvider } from '../../../data-provider/product-offering.provider';
import { IServiceErrorProvider } from '../../../data-provider/service-error.provider';
import { IServiceTracingProvider } from '../../../data-provider/service-tracing.provider';
import { ITechnologyProvider } from '../../../data-provider/technology.provider';
import {
  dataCatalogResponseMock,
  findResultResponseMock,
  mockParamsPriceLists,
} from '../../../mockup/stubs';
import { ParamUcimpl } from '../resource/impl/param.resource.uc.impl';
import { PricesHelperUcImpl } from './prices-helper.uc.impl';

describe('PricesHelperUcImpl', () => {
  let pricesHelperUc: PricesHelperUcImpl;
  let mockPricesProvider: jest.Mocked<IPricesProvider>;
  let mockProductOfferingProvider: jest.Mocked<IProductOfferingProvider>;
  let mockEquipmentProvider: jest.Mocked<IEquipmentProvider>;
  let mockTechnologyProvider: jest.Mocked<ITechnologyProvider>;
  let mockServiceTracingProvider: jest.Mocked<IServiceTracingProvider>;
  let mockServiceErrorProvider: jest.Mocked<IServiceErrorProvider>;

  beforeEach(async () => {
    mockPricesProvider = {
      findLastPrices: jest.fn(),
      saveDataLastPrices: jest.fn(),
    } as jest.Mocked<IPricesProvider>;

    mockProductOfferingProvider = {
      getData: jest.fn(),
    } as jest.Mocked<IProductOfferingProvider>;

    mockEquipmentProvider = {
      insertMany: jest.fn(),
      deleteAll: jest.fn(),
    } as jest.Mocked<IEquipmentProvider>;

    mockTechnologyProvider = {
      insertMany: jest.fn(),
      deleteAll: jest.fn(),
    } as jest.Mocked<ITechnologyProvider>;

    mockServiceTracingProvider = {
      createServiceTracing: jest.fn(),
    } as jest.Mocked<IServiceTracingProvider>;

    mockServiceErrorProvider = {
      createServiceError: jest.fn(),
      getServiceErrors: jest.fn(),
      getTotal: jest.fn(),
      getServiceError: jest.fn(),
    } as jest.Mocked<IServiceErrorProvider>;

    pricesHelperUc = new PricesHelperUcImpl(
      mockPricesProvider,
      mockProductOfferingProvider,
      mockEquipmentProvider,
      mockTechnologyProvider,
      mockServiceTracingProvider,
      mockServiceErrorProvider,
    );

    Object.defineProperty(ParamUcimpl, 'getMessages', {
      value: mockParamsPriceLists,
    });

  });

  describe('Equipment case', () => {
    it('should called all the provider needed for equipment', async () => {

      mockEquipmentProvider.deleteAll.mockResolvedValue(true);
      mockProductOfferingProvider.getData.mockResolvedValue(
        dataCatalogResponseMock,
      );
      mockPricesProvider.findLastPrices.mockResolvedValue(
        findResultResponseMock,
      );
      mockPricesProvider.saveDataLastPrices.mockResolvedValue(
        findResultResponseMock,
      );
      mockEquipmentProvider.insertMany.mockResolvedValue(true);

      await pricesHelperUc.pricesHelper(FamilyParams.equipment);

      expect(mockEquipmentProvider.deleteAll).toBeCalledTimes(1);
      expect(mockProductOfferingProvider.getData).toHaveBeenCalled();
      expect(mockPricesProvider.findLastPrices).toHaveBeenCalled();
      expect(mockPricesProvider.saveDataLastPrices).toHaveBeenCalled();
      expect(mockEquipmentProvider.insertMany).toBeCalledTimes(1);
    });
  });

  describe('Technology case', () => {
    it('should called all the provider needed for technology', async () => {
      mockEquipmentProvider.deleteAll.mockResolvedValue(true);
      mockProductOfferingProvider.getData.mockResolvedValue(
        dataCatalogResponseMock,
      );
      mockPricesProvider.findLastPrices.mockResolvedValue(
        findResultResponseMock,
      );
      mockPricesProvider.saveDataLastPrices.mockResolvedValue(
        findResultResponseMock,
      );
      mockEquipmentProvider.insertMany.mockResolvedValue(true);

      await pricesHelperUc.pricesHelper(FamilyParams.technology);

      expect(mockTechnologyProvider.deleteAll).toBeCalledTimes(1);
      expect(mockProductOfferingProvider.getData).toHaveBeenCalled();
      expect(mockPricesProvider.findLastPrices).toHaveBeenCalled();
      expect(mockPricesProvider.saveDataLastPrices).toHaveBeenCalled();
      expect(mockTechnologyProvider.insertMany).toBeCalledTimes(1);
    });
  });

  describe('Error Business Cases', () => {
    it('should return nothing because of lack of data in product offering', async () => {
      mockProductOfferingProvider.getData.mockResolvedValue(null);

      await pricesHelperUc.pricesHelper(FamilyParams.technology);

      expect(mockProductOfferingProvider.getData).toHaveBeenCalled();
      expect(mockTechnologyProvider.deleteAll).not.toHaveBeenCalled();
    });
    it('should create service error when error to Get Product offering data', async () => {
      mockEquipmentProvider.deleteAll.mockResolvedValue(true);
      mockProductOfferingProvider.getData.mockRejectedValue(
        new Error('No Connection'),
      );

      try {
        await pricesHelperUc.pricesHelper(FamilyParams.technology);
        expect(mockTechnologyProvider.deleteAll).toBeCalledTimes(1);
        expect(mockProductOfferingProvider.getData).toBeCalledTimes(1);
        expect(mockPricesProvider.findLastPrices).not.toHaveBeenCalled();
      } catch (error) {
        expect(mockServiceErrorProvider.createServiceError).toHaveBeenCalled();
      }
    });
    it('should create service error when error find last prices', async () => {
      mockTechnologyProvider.deleteAll.mockResolvedValue(true);
      mockProductOfferingProvider.getData.mockResolvedValue(
        dataCatalogResponseMock,
      );
      mockPricesProvider.findLastPrices.mockRejectedValue(
        new Error('No Connection'),
      );

      try {
        await pricesHelperUc.pricesHelper(FamilyParams.technology);
        expect(mockTechnologyProvider.deleteAll).toBeCalledTimes(1);
        expect(mockProductOfferingProvider.getData).toHaveBeenCalled();
        expect(mockPricesProvider.findLastPrices).toHaveBeenCalled();
      } catch (error) {
        expect(mockServiceErrorProvider.createServiceError).toHaveBeenCalled();
      }
    });
    it('should create service error when error inserting data in the different flow collections', async () => {
      mockEquipmentProvider.deleteAll.mockResolvedValue(true);
      mockProductOfferingProvider.getData.mockResolvedValue(
        dataCatalogResponseMock,
      );
      mockPricesProvider.findLastPrices.mockResolvedValue(
        findResultResponseMock,
      );
      mockPricesProvider.saveDataLastPrices.mockResolvedValue(
        findResultResponseMock,
      );
      mockTechnologyProvider.insertMany.mockRejectedValue(
        new Error('No Connection'),
      );

      try {
        await pricesHelperUc.pricesHelper(FamilyParams.technology);
        expect(mockTechnologyProvider.deleteAll).toBeCalledTimes(1);
        expect(mockProductOfferingProvider.getData).toHaveBeenCalled();
        expect(mockPricesProvider.findLastPrices).toHaveBeenCalled();
        expect(mockPricesProvider.saveDataLastPrices).toHaveBeenCalled();
        expect(mockTechnologyProvider.insertMany).toBeCalledTimes(1);
      } catch (error) {
        expect(mockServiceErrorProvider.createServiceError).toHaveBeenCalled();
      }
    });
  });
});
