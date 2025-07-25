import { IPriceProvider } from 'src/data-provider/provider/prices/price.provider';
import { IServiceTracingUc } from '../../resource/service-tracing.resource.uc';
import { TransformPricesUc } from './transform-prices.uc.impl';
import { ValuesParams } from 'src/common/utils/enums/params.enum';
import { IGetErrorTracingUc } from 'src/core/use-case/resource/get-error-tracing.resource.uc';
import { IPricesProductOfferingUC } from '../product-offering-prices.uc';
import { EDescriptionTracingGeneral, EStatusTracingGeneral, ETaskTracingGeneral } from 'src/common/utils/enums/tracing.enum';

describe('TransformPricesUc', () => {
  let service: TransformPricesUc;
  let priceProviderMock: jest.Mocked<IPriceProvider>;
  let serviceTracingMock: jest.Mocked<IServiceTracingUc>;
  let IGetErrorTracingUcMock: jest.Mocked<IGetErrorTracingUc>;
  let IPricesProductOfferingUCMock: jest.Mocked<IPricesProductOfferingUC>;

  beforeEach(() => {
    priceProviderMock = {
      saveTransformData: jest.fn(),
      deleteDataColPrtProductOffering: jest.fn(),
      deletePricesCollections: jest.fn(),
      getJoinPricesFeatures: jest.fn(),
    };

    serviceTracingMock = {
      createServiceTracing: jest.fn(),
    };

    IGetErrorTracingUcMock = {
      createTraceability: jest.fn(),
      getError: jest.fn(),
    };

    service = new TransformPricesUc(
      priceProviderMock,
      IPricesProductOfferingUCMock,
      IGetErrorTracingUcMock,
      serviceTracingMock,
    );
  });

  describe('startVariables', () => {
    it('should reset the variables', () => {
      service.startVariables();
    });
  });

  describe('paginationDB', () => {
    it('should paginate and save data', async () => {
      jest.spyOn(service, 'paginationDB');

      await service.paginationDB(ValuesParams.PRICESEQU);

      expect(service.paginationDB).toHaveBeenCalledTimes(1);
    });

    it('should paginate and save data PRICESTEC', async () => {
      jest.spyOn(service, 'paginationDB');

      await service.paginationDB(ValuesParams.PRICESTEC);

      expect(service.paginationDB).toHaveBeenCalledTimes(1);
    });

  });

  describe('transformPrices', () => {
    it('should call transformPrices', async () => {
      const isEquip = "Tecnologia"
      const filter = "PO_Tec"
      const colleccion = 'COLPRTFREEEQUIPPRICES'
      jest.spyOn(service, 'transformPrices');

      await service.transformPrices(colleccion,isEquip,'TerminalesLibres');
      await priceProviderMock.getJoinPricesFeatures(colleccion,filter)
      await IGetErrorTracingUcMock.createTraceability(EStatusTracingGeneral.STATUS_SUCCESS,
        EDescriptionTracingGeneral.EQU_COLL_COLPRTPRODUCTOFFERING, ETaskTracingGeneral.DELETE_DATA);

      expect(IGetErrorTracingUcMock.createTraceability).toHaveBeenCalled();
      expect(priceProviderMock.getJoinPricesFeatures).toHaveBeenCalled();
      expect(service.transformPrices).toHaveBeenCalledTimes(1);
    });

    it('should call transformPrices error', async () => {
      const isEquip = "Tecnologia"
      const filter = "PO_Tec"
      const colleccion = 'COLPRTFREEEQUIPPRICES'
      jest.spyOn(service, 'transformPrices');

      priceProviderMock.getJoinPricesFeatures.mockRejectedValue(new Error());
      await service.transformPrices(colleccion,isEquip,'TerminalesLibres');

      expect(IGetErrorTracingUcMock.getError).toHaveBeenCalled();
      expect(priceProviderMock.getJoinPricesFeatures).toHaveBeenCalled();
      expect(service.transformPrices).toHaveBeenCalledTimes(1);
    });

    
  });
});
