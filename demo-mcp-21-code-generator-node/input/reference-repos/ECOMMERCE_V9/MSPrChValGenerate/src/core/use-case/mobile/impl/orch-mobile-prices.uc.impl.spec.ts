import { ISftpManagerProvider } from 'src/data-provider/provider/downloadFile/sftp-manager.provider';
import { MobilePricesAttributesUc } from './orch-mobile-prices-attributes.uc.impl';
import { IFileManagerProvider } from 'src/data-provider/provider/downloadFile/file-manager.provider';
import { IParamProvider } from 'src/data-provider/param.provider';
import { IServiceTracingUc } from '../../resource/service-tracing.resource.uc';
import { IServiceErrorUc } from '../../resource/service-error.resource.uc';
import { IMobilePricesAttributesProvider } from 'src/data-provider/provider/mobile/mobile-prices-attributes.provider';
import { IPriceProvider } from 'src/data-provider/provider/prices/price.provider';
import { ICollectionMongoDBProvider } from 'src/data-provider/collectionMongoDB.provider';
 
jest.mock('@claro/logging-library', () => ({
  promises: {
    logger: jest.fn().mockResolvedValue,
    logOutput: jest.fn().mockResolvedValue,
  },
}));
 
jest.mock('fs', () => ({
  promises: {
    unlinkSync: jest.fn().mockResolvedValue,
    readFileSync: jest.fn().mockResolvedValue,
  },
}));
 
describe('MobilePricesAttributesUc', () => {
  let mobilePricesAttributesUc: MobilePricesAttributesUc;
 
  let mockISftpManagerProvider: jest.Mocked<ISftpManagerProvider>;
  let mockIFileManagerProvider: jest.Mocked<IFileManagerProvider>;
  let mockIParamProvider: jest.Mocked<IParamProvider>;
  let mockIServiceTracingUc: jest.Mocked<IServiceTracingUc>;
  let mockIServiceErrorUc: jest.Mocked<IServiceErrorUc>;
  let mockIMobilePricesAttributesProvider: jest.Mocked<IMobilePricesAttributesProvider>;
  let mockIPriceProvider: jest.Mocked<IPriceProvider>;
 
  let mockICollectionMongoDBProvider: jest.Mocked<ICollectionMongoDBProvider>;
 
  beforeEach(async () => {
    mockISftpManagerProvider = {
      download: jest.fn(),
      downloadMovHom: jest.fn(),
      writeFile: jest.fn(),
    } as jest.Mocked<ISftpManagerProvider>;
 
    mockIFileManagerProvider = {
      deleteFile: jest.fn(),
      getDataCsv: jest.fn(),
      getDataCsvHeader: jest.fn(),
      saveDataTemporalCollection: jest.fn(),
      saveDataTemporalCollectionHomes: jest.fn(),
    } as jest.Mocked<IFileManagerProvider>;
 
    mockIParamProvider = {
      getParams: jest.fn(),
      getTotal: jest.fn(),
      getParamByIdParam: jest.fn(),
      updateParam: jest.fn(),
      setLoadTime: jest.fn(),
      getFeaturesEnabled: jest.fn(),
    } as jest.Mocked<IParamProvider>;
 
    mockIServiceTracingUc = {
      createServiceTracing: jest.fn(),
    } as jest.Mocked<IServiceTracingUc>;
 
    mockIServiceErrorUc = {
      createServiceError: jest.fn(),
    } as jest.Mocked<IServiceErrorUc>;
 
    mockICollectionMongoDBProvider = {
      getDataMongoCollection: jest.fn(),
      getDataMongoCollectionAggregate: jest.fn(),
      getDataMongoCollectionPruebas: jest.fn(),
    } as jest.Mocked<ICollectionMongoDBProvider>;
 
    mockIMobilePricesAttributesProvider = {
      saveDataMobileGeneralPrices: jest.fn(),
      saveDataMobileGeneralAttributes: jest.fn(),
      deleteDataMobileAttributes: jest.fn(),
      saveDataTemporalCollectionMovil: jest.fn(),
      deleteDataMobilePrices: jest.fn(),
      createLog: jest.fn(),
    } as jest.Mocked<IMobilePricesAttributesProvider>;
 
    mockIPriceProvider = {
      saveTransformData: jest.fn(),
      deleteDataColPrtProductOffering: jest.fn(),
      deletePricesCollections: jest.fn(),
      getJoinPricesFeatures: jest.fn(),
    } as jest.Mocked<IPriceProvider>;
 
    mobilePricesAttributesUc = new MobilePricesAttributesUc(
      mockISftpManagerProvider,
      mockIFileManagerProvider,
      mockIParamProvider,
      mockIServiceTracingUc,
      mockIServiceErrorUc,
      mockIMobilePricesAttributesProvider,
      mockIPriceProvider,
    );
  });
 
  describe('getOrchMobile', () => {
    it('should have the correct values on getOrchMobile', () => {
      expect(mobilePricesAttributesUc).toBeDefined();
    });
  });
});
 