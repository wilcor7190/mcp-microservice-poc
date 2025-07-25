import { Test, TestingModule } from "@nestjs/testing"
import { dataEquipmentDummy, dataTechnologyDummy } from "../../../../../test/response-dummy"
import { IDataloadProvider } from "../../../../data-provider/dataload.provider"
import { ISftpProvider } from "../../../../data-provider/sftp.provider"
import { IServiceErrorUc } from "../../resource/service-error.resource.uc"
import { IServiceTracingUc } from "../../resource/service-tracing.resource.uc"
import { ISalesCatalogUC } from "../sales-catalog.uc"
import { ProductDataUC } from "./product-data.uc.impl"
import { IParamProvider } from "../../../../data-provider/param.provider"
import CreateCsv from '../../../../common/utils/createCsv';
import { mockResponseEquipmentFilter } from "../../../../mockup/stubs"
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

const salesCatalogUcMock = {
  dataLoadConfiguration: jest.fn(),
  dataLoadConfigurationB2b: jest.fn(),
};

const dataloadProviderMock = {
  findEquipment: jest.fn(),
  findEquipmentFilter: jest.fn(),
  findTechnology: jest.fn(),
  findPospago: jest.fn(),
  findPrepago: jest.fn(),
  findHomes: jest.fn(),
  saveListParents: jest.fn(),
  getListParents: jest.fn(),
  orderListParent: jest.fn(),
};

let paramProvider: IParamProvider;    
 
describe('ProductDataUC', () => {
  let productDataUC: ProductDataUC;
 
  beforeEach(async () => {
    paramProvider = {
      getParams: jest.fn(),
      getTotal: jest.fn(),
      getParamByIdParam: jest.fn(),
      updateParam: jest.fn(),
    } as jest.Mocked<IParamProvider>;
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductDataUC,
        { provide: ISftpProvider, useValue: sftpProviderMock },
        { provide: ISalesCatalogUC, useValue: salesCatalogUcMock },
        { provide: IServiceErrorUc, useValue: serviceErrorUcMock },
        { provide: IServiceTracingUc, useValue: serviceTracingUcMock },
        { provide: IDataloadProvider, useValue: dataloadProviderMock },
        { provide: IParamProvider, useValue: paramProvider },
      ],
    }).compile();
 
    productDataUC = module.get<ProductDataUC>(ProductDataUC);
  });
 
  afterEach(() => {
    jest.clearAllMocks();
  });

 
  it('should call the necessary methods to create dataload Equipment', async () => {
    const path = '/path/to/dataload.csv';
    const pathB2b = '/path/to/dataload.csv';
    const pathSalesCatalog = '/path/to/dataload.csv';
    const pathSalesCatalogB2b = '/path/to/dataload1.csv'; 
    const pathExpect ='/path/to/dataload.csvclaro-producto-data.csv';

    salesCatalogUcMock.dataLoadConfiguration.mockResolvedValue({});
    salesCatalogUcMock.dataLoadConfigurationB2b.mockResolvedValue({});
    dataloadProviderMock.findEquipment.mockResolvedValue(mockResponseEquipmentFilter);

    (CreateCsv.createCsv as jest.Mock).mockResolvedValue(undefined);
    (CreateCsv.unificateFiles as jest.Mock).mockResolvedValue(undefined);
 
    // Call the method
    jest.spyOn(productDataUC, 'dataLoadConfiguration');
    let data = {
      Terminales: dataEquipmentDummy,
      Tecnologia: [],
      Pospago: [],
      Prepago: [],
      Hogares: [],
    }
    await productDataUC.dataLoadConfiguration(data, path, pathB2b, pathSalesCatalog, pathSalesCatalogB2b);
 
    // Assertions
    expect(salesCatalogUcMock.dataLoadConfiguration).toHaveBeenCalled;
    expect(salesCatalogUcMock.dataLoadConfigurationB2b).toHaveBeenCalled;
    expect(sftpProviderMock.update).toHaveBeenCalledWith(expect.any(String), pathExpect);
    expect(CreateCsv.createCsv).toHaveBeenCalledWith(
      expect.any(Array),
      expect.any(String),
      expect.any(Array),
      'CatalogEntry',
      'product_data_0',
    );
    expect(CreateCsv.unificateFiles).toHaveBeenCalledWith(
      'product_data_0',
      expect.any(String),
    );
  });

  it('should call the necessary methods to create dataload', async () => {
    const path = '/path/to/dataload.csv';
    const pathB2b = '/path/to/dataload.csv';
    const pathSalesCatalogB2b = '/path/to/dataload.csv';
    const pathExpect ='/path/to/dataload.csvclaro-producto-data.csv';
    const pathSalesCatalog = '/path/to/dataload.csv';

    salesCatalogUcMock.dataLoadConfiguration.mockResolvedValue({});
    salesCatalogUcMock.dataLoadConfigurationB2b.mockResolvedValue({});
    
  
    (CreateCsv.createCsv as jest.Mock).mockResolvedValue(undefined);
    (CreateCsv.unificateFiles as jest.Mock).mockResolvedValue(undefined);
 
    // Call the method
    jest.spyOn(productDataUC, 'dataLoadConfiguration');
    await productDataUC.dataLoadConfiguration(dataTechnologyDummy, path, pathB2b, pathSalesCatalog, pathSalesCatalogB2b);
 
    // Assertions
    expect(salesCatalogUcMock.dataLoadConfiguration).toHaveBeenCalled();
    expect(sftpProviderMock.update).toHaveBeenCalledWith(expect.any(String), pathExpect);
    expect(CreateCsv.createCsv).toHaveBeenCalledWith(
      expect.any(Array),
      expect.any(String),
      expect.any(Array),
      'CatalogEntry',
      'product_data_0',
    );
    expect(CreateCsv.unificateFiles).toHaveBeenCalledWith(
      'product_data_0',
      expect.any(String),
    );
  });
});

