import { ResponseService } from 'src/controller/dto/response-service.dto';
import { BulkManualDTO } from 'src/controller/dto/general/general.dto';
import { IFeaturesUC } from 'src/core/use-case/features/orch-features.uc';
import { IPricesUc } from 'src/core/use-case/prices/orch-prices.uc';
import { IHomesPricesAttributesUc } from 'src/core/use-case/home/orch-homes-prices-attributes.uc';
import { IMobilePricesAttributesUc } from 'src/core/use-case/mobile/orch-mobile-prices-attributes.uc';
import { ContingencyService } from './contingency.service.impl';
import { IServiceErrorUc } from "src/core/use-case/resource/service-error.resource.uc";
import { IGetErrorTracingUc } from 'src/core/use-case/resource/get-error-tracing.resource.uc';

describe('ContingencyService', () => {
  let contingencyService: ContingencyService;
  let featuresUCMock: jest.Mocked<IFeaturesUC>;
  let pricesUCMock: jest.Mocked<IPricesUc>;
  let homesPricesAttributesUCMock: jest.Mocked<IHomesPricesAttributesUc>;
  let mobilePricesAttributesUCMock: jest.Mocked<IMobilePricesAttributesUc>;
  let mockIGetErrorTracingUc: jest.Mocked<IGetErrorTracingUc>;
  let mockIServiceErrorUc: jest.Mocked<IServiceErrorUc>;

  beforeEach(() => {
    featuresUCMock = {
      getOrch: jest.fn().mockResolvedValue(undefined),
      updateOrch: jest.fn().mockResolvedValue(undefined), // Agrega este mock para el método updateOrch
    } as jest.Mocked<IFeaturesUC>;

    pricesUCMock = {
      getOrch: jest.fn().mockResolvedValue(undefined),
    } as jest.Mocked<IPricesUc>;

    homesPricesAttributesUCMock = {
      getHomeAttributes: jest.fn().mockResolvedValue(undefined),
      getHomePrices: jest.fn().mockResolvedValue(undefined),
      getOrchHomes: jest.fn().mockResolvedValue(undefined),
    } as jest.Mocked<IHomesPricesAttributesUc>;

    mobilePricesAttributesUCMock = {
      getMovileAttributes: jest.fn().mockResolvedValue(undefined),
      getMobilePrices: jest.fn().mockResolvedValue(undefined),
      getOrchMobile: jest.fn().mockResolvedValue(undefined),
    } as jest.Mocked<IMobilePricesAttributesUc>;

    mockIGetErrorTracingUc = {
      createTraceability: jest.fn().mockResolvedValue(undefined),
      getError: jest.fn().mockResolvedValue(undefined),
    } as jest.Mocked<IGetErrorTracingUc>;

    mockIServiceErrorUc = {
      createServiceError: jest.fn().mockResolvedValue(undefined),
    } as jest.Mocked<IServiceErrorUc>;

    contingencyService = new ContingencyService(
      featuresUCMock,
      pricesUCMock,
      homesPricesAttributesUCMock,
      mobilePricesAttributesUCMock,
      mockIServiceErrorUc,
      mockIGetErrorTracingUc
    );
  });

  describe('getData', () => {
    it('should call getOrch for Features and Prices', async () => {
      // Arrange

      featuresUCMock.getOrch.mockResolvedValue(undefined);
      pricesUCMock.getOrch.mockResolvedValue(undefined);

      // Act
      const result = await contingencyService.getData();

      // Assert
      expect(featuresUCMock.getOrch).toHaveBeenCalled();
      expect(pricesUCMock.getOrch).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });

  describe('getDataMobile', () => {
    it('should call getOrch for Mobile', async () => {
      // Arrange

      mobilePricesAttributesUCMock.getOrchMobile.mockResolvedValue(undefined);

      // Act
      const result = await contingencyService.getDataMobile();

      // Assert
      expect(mobilePricesAttributesUCMock.getOrchMobile).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });

  describe('getDataHomes', () => {
    it('should call getOrch for Homes', async () => {
      // Arrange

      homesPricesAttributesUCMock.getOrchHomes.mockResolvedValue(undefined);

      // Act
      const result = await contingencyService.getDataHomes();

      // Assert
      expect(homesPricesAttributesUCMock.getOrchHomes).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });



  describe('getDataManual', () => {

    describe('getDataManual Caracteristicas', () => {
      it('dshould call getHomeAttributes for homes and return a ResponseService', async () => {
        const req: BulkManualDTO = {
          fileType: 'Caracteristicas',
          category: 'Hogares',
        };
        const expectedResponse: ResponseService<any> = new ResponseService(
          true,
          'La Carga ha iniciado',
          200,
          {}
        );
        const result = await contingencyService.getDataManual(req);
        expect(homesPricesAttributesUCMock.getHomeAttributes).toHaveBeenCalled();
        expect(result).toBeDefined()      });

      it('dshould call getMovileAttributes for mobiles and return a ResponseService', async () => {
        const req: BulkManualDTO = {
          fileType: 'Caracteristicas',
          category: 'Movil',
        };
        const expectedResponse: ResponseService<any> = new ResponseService(
          true,
          'La Carga ha iniciado',
          200,
          {}
        );
        const result = await contingencyService.getDataManual(req);
        expect(mobilePricesAttributesUCMock.getMovileAttributes).toHaveBeenCalled();
        expect(result).toBeDefined();
      });

      it('dshould call getOrch for equipment and return a ResponseService', async () => {
        const req: BulkManualDTO = {
          fileType: 'Caracteristicas',
          category: 'Equipos',
        };
        const expectedResponse: ResponseService<any> = new ResponseService(
          true,
          'La Carga ha iniciado',
          200,
          {}
        );
        const result = await contingencyService.getDataManual(req);
        expect(featuresUCMock.getOrch).toHaveBeenCalled();
        expect(result).toBeDefined();
      });


    })

    describe('getDataManual Precios', () => {
      it('dshould call getHomePrices for homes and return a ResponseService', async () => {
        const req: BulkManualDTO = {
          fileType: 'Precios',
          category: 'Hogares',
        };
        const expectedResponse: ResponseService<any> = new ResponseService(
          true,
          'La Carga ha iniciado',
          200,
          {}
        );
        const result = await contingencyService.getDataManual(req);
        expect(homesPricesAttributesUCMock.getHomePrices).toHaveBeenCalled();
        expect(result).toBeDefined();
      });

      it('dshould call getMobilePrices for mobiles and return a ResponseService', async () => {
        const req: BulkManualDTO = {
          fileType: 'Precios',
          category: 'Movil',
        };
        const expectedResponse: ResponseService<any> = new ResponseService(
          true,
          'La Carga ha iniciado',
          200,
          {}
        );
        const result = await contingencyService.getDataManual(req);
        expect(mobilePricesAttributesUCMock.getMobilePrices).toHaveBeenCalled();
        expect(result).toBeDefined();
      });

      it('dshould call getOrch for equipment and return a ResponseService', async () => {
        const req: BulkManualDTO = {
          fileType: 'Precios',
          category: 'Equipos',
        };
        const expectedResponse: ResponseService<any> = new ResponseService(
          true,
          'La Carga ha iniciado',
          200,
          {}
        );
        const result = await contingencyService.getDataManual(req);
        expect(pricesUCMock.getOrch).toHaveBeenCalled();
        expect(result).toBeDefined();
      });


    })

    it('debe log un error y regresar un ResponseService cuando hay categoria invalida', async () => {
      // Arrange
      const req: BulkManualDTO = {
        fileType: 'Caracteristicas',
        category: 'InvalidCategory',
      };
      const expectedResponse: ResponseService<any> = new ResponseService(
        true,
        'La Carga ha iniciado',
        200,
        {}
      );

      // Act
      const result = await contingencyService.getDataManual(req);

      // Assert
      expect(homesPricesAttributesUCMock.getHomeAttributes).not.toHaveBeenCalled();
      expect(result).toBeDefined();

    });

    it('debe log un error y regresar un ResponseService cuando hay categoria invalida', async () => {
      // Arrange
      const req: BulkManualDTO = {
        fileType: 'Precios',
        category: 'InvalidCategory',
      };
      const expectedResponse: ResponseService<any> = new ResponseService(
        true,
        'La Carga ha iniciado',
        200,
        {}
      );

      // Act
      const result = await contingencyService.getDataManual(req);

      // Assert
      expect(homesPricesAttributesUCMock.getHomeAttributes).not.toHaveBeenCalled();
      expect(result).toBeDefined();

    });
  });

  describe('Test error', () => {

    it('getData Error', async () => {
      featuresUCMock.getOrch.mockRejectedValue(new Error());

      await contingencyService.getData();

      expect(mockIGetErrorTracingUc.createTraceability).toHaveBeenCalled();
      expect(mockIServiceErrorUc.createServiceError).toHaveBeenCalled();
    });

    it('getDataHomes Error', async () => {
      homesPricesAttributesUCMock.getOrchHomes.mockRejectedValue(new Error());

      await contingencyService.getDataHomes();

      expect(mockIGetErrorTracingUc.createTraceability).toHaveBeenCalled();
      expect(mockIServiceErrorUc.createServiceError).toHaveBeenCalled();
    });

    it('getDataMobile Error', async () => {
      mobilePricesAttributesUCMock.getOrchMobile.mockRejectedValue(new Error());

      await contingencyService.getDataMobile();

      expect(mockIGetErrorTracingUc.createTraceability).toHaveBeenCalled();
      expect(mockIServiceErrorUc.createServiceError).toHaveBeenCalled();
    });


  })
});
