import { Test, TestingModule } from '@nestjs/testing';
import { PriceListUC } from './price-list.uc.impl';
import { IDataloadProvider } from '../../../../data-provider/dataload.provider';
import { IDataloadProviderPrices } from '../../../../data-provider/dataload-prices.provider';
import { ISftpProvider } from '../../../../data-provider/sftp.provider';
import { IServiceErrorUc } from '../../resource/service-error.resource.uc';
import { IServiceTracingUc } from '../../resource/service-tracing.resource.uc';
import CreateCsv from '../../../../common/utils/createCsv';
jest.mock('../../../../common/utils/createCsv'); 

// Mock dependencies
const sftpProviderMock = {
  readFileImg: jest.fn(),
  update: jest.fn(),
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
 
const dataloadProviderPricesMock = {
  getPrices: jest.fn(),
  findDisponibility: jest.fn(),
};
 
const serviceErrorUcMock = {
  // Mock necessary methods here if needed
};
 
const serviceTracingUcMock = {
  createServiceTracing: jest.fn(),
};
 
describe('PriceListUC', () => {
  let priceListUC: PriceListUC;
 
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PriceListUC,
        { provide: ISftpProvider, useValue: sftpProviderMock },
        { provide: IDataloadProvider, useValue: dataloadProviderMock },
        {
          provide: IDataloadProviderPrices,
          useValue: dataloadProviderPricesMock,
        },
        { provide: IServiceErrorUc, useValue: serviceErrorUcMock },
        { provide: IServiceTracingUc, useValue: serviceTracingUcMock },
      ],
    }).compile();
 
    priceListUC = module.get<PriceListUC>(PriceListUC);
  });
 
  afterEach(() => {
    jest.clearAllMocks();
  });
 
  it('should call the necessary methods to create dataload', async () => {
    const path = '/path/to/dataload.csv';
    const pathB2b = '/path/to/dataload.csv';
 
    dataloadProviderMock.getListParents.mockResolvedValue([
      { parentPartNumber: '123' },
    ]);
 
    dataloadProviderPricesMock.getPrices.mockResolvedValue([
      { CatentryPartNumber: '456' },
    ]);
 
    (CreateCsv.createCsv as jest.Mock).mockResolvedValue(undefined);
    (CreateCsv.unificateFiles as jest.Mock).mockResolvedValue(undefined);
 
    // Call the method
    jest.spyOn(priceListUC, 'dataLoadConfiguration');
    await priceListUC.dataLoadConfiguration(path, pathB2b);
 
    // Assertions
    expect(dataloadProviderMock.getListParents).toHaveBeenCalled();
    expect(dataloadProviderPricesMock.getPrices).toHaveBeenCalled();
    expect(sftpProviderMock.update).toHaveBeenCalledWith(expect.any(String), path);
    expect(CreateCsv.createCsv).toHaveBeenCalledWith(
      expect.any(Array),
      expect.any(String),
      expect.any(Array),
      'Offer',
      'price_catalog_0',
    );
    expect(CreateCsv.unificateFiles).toHaveBeenCalledWith(
      'price_catalog_0',
      expect.any(String),
    );
  });
});