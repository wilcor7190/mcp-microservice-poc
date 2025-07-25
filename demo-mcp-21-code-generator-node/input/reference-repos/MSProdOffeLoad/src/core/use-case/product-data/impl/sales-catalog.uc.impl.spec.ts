import { Test, TestingModule } from "@nestjs/testing";
import { dataEquipmentDummy } from "../../../../../test/response-dummy";
import { ISftpProvider } from "../../../../data-provider/sftp.provider";
import { IServiceErrorUc } from "../../resource/service-error.resource.uc";
import { IServiceTracingUc } from "../../resource/service-tracing.resource.uc";
import { SalesCatalogUC } from "./sales-catalog.uc.impl";
import CreateCsv from '../../../../common/utils/createCsv';
jest.mock('../../../../common/utils/createCsv');


// Mock dependencies
const sftpProviderMock = {
  readFileImg: jest.fn(),
  update: jest.fn(),
};

const serviceErrorUcMock = {
  // Mock necessary methods here if needed
};

const serviceTracingUcMock = {
  createServiceTracing: jest.fn(),
};


describe('SalesCatalogUC', () => {
  let salesCatalogUC: SalesCatalogUC;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalesCatalogUC,
        { provide: ISftpProvider, useValue: sftpProviderMock },
        { provide: IServiceErrorUc, useValue: serviceErrorUcMock },
        { provide: IServiceTracingUc, useValue: serviceTracingUcMock },
      ],
    }).compile();

    salesCatalogUC = module.get<SalesCatalogUC>(SalesCatalogUC);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call the necessary methods to create dataLoadConfiguration', async () => {

    const path = '/path/to/dataload.csv';

    (CreateCsv.createCsv as jest.Mock).mockResolvedValue(undefined);
    (CreateCsv.unificateFiles as jest.Mock).mockResolvedValue(undefined);

    // Mock update method of sftpProvider
    sftpProviderMock.update.mockResolvedValue({});

    jest.spyOn(salesCatalogUC, 'dataLoadConfiguration');
    await salesCatalogUC.dataLoadConfiguration(dataEquipmentDummy, path);

    // Assertions
    expect(sftpProviderMock.update).toHaveBeenCalledWith(expect.any(String), path);
    expect(CreateCsv.createCsv).toHaveBeenCalledWith(
      expect.any(Array),
      expect.any(String),
      expect.any(Array),
      'CatalogEntryParentCatalogGroupRelationship',
      'SalesCatalogGroupCatalogEntries_0',
    );
    expect(CreateCsv.unificateFiles).toHaveBeenCalledWith(
      'SalesCatalogGroupCatalogEntries_0',
      expect.any(String),
    );  });

    it('should call the necessary methods to create dataLoadConfigurationB2B', async () => {

      const path = '/path/to/dataload.csv';
  
      (CreateCsv.createCsv as jest.Mock).mockResolvedValue(undefined);
      (CreateCsv.unificateFiles as jest.Mock).mockResolvedValue(undefined);
  
      // Mock update method of sftpProvider
      sftpProviderMock.update.mockResolvedValue({});
  
      jest.spyOn(salesCatalogUC, 'dataLoadConfigurationB2b');
      await salesCatalogUC.dataLoadConfigurationB2b(dataEquipmentDummy, path);
  
      // Assertions
      expect(sftpProviderMock.update).toHaveBeenCalledWith(expect.any(String), path);
      expect(CreateCsv.createCsv).toHaveBeenCalledWith(
        expect.any(Array),
        expect.any(String),
        expect.any(Array),
        'CatalogEntryParentCatalogGroupRelationship',
        'SalesCatalogGroupCatalogEntries_0',
      );
      expect(CreateCsv.unificateFiles).toHaveBeenCalledWith(
        'SalesCatalogGroupCatalogEntries_0',
        expect.any(String),
      );  });
});