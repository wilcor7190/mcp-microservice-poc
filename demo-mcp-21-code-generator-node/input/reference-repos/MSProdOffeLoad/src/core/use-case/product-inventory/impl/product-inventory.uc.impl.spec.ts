import { Test, TestingModule } from "@nestjs/testing"
import { dataCategories } from "../../../../../test/response-dummy"
import { IDataloadProviderPrices } from "../../../../data-provider/dataload-prices.provider"
import { ISftpProvider } from "../../../../data-provider/sftp.provider"
import { IServiceErrorUc } from "../../resource/service-error.resource.uc"
import { ProductInventoryUC } from "./product-inventory.uc.impl"
import CreateCsv from '../../../../common/utils/createCsv';
jest.mock('../../../../common/utils/createCsv'); 
 
const sftpProviderMock = {
  readFileImg: jest.fn(),
  update: jest.fn(),
};
 
const serviceErrorUcMock = {
  // Mock necessary methods here if needed
};

const dataloadProviderPricesMock = {
  getPrices: jest.fn(),
  findDisponibility: jest.fn(),
};
 
describe('ProductInventoryUC', () => {
  let productInventoryUC: ProductInventoryUC;
 
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductInventoryUC,
        { provide: ISftpProvider, useValue: sftpProviderMock },
        {
          provide: IDataloadProviderPrices,
          useValue: dataloadProviderPricesMock,
        },
        { provide: IServiceErrorUc, useValue: serviceErrorUcMock },
      ],
    }).compile();
 
    productInventoryUC = module.get<ProductInventoryUC>(ProductInventoryUC);
  });
 
  afterEach(() => {
    jest.clearAllMocks();
  });
 
  it('should call the necessary methods to create dataload', async () => {
    const path = '/claroshopv9qa/claro/catlogue/v9/Contingencia/attribute_product/processed/terminales/claro-atributo-rel-producto.csv';
    const pathB2b = '/claroshopv9qa/claro/catlogue/v9/Contingencia/attribute_product/processed/terminales/claro-atributo-rel-producto.csv';
  
    (CreateCsv.createCsv as jest.Mock).mockResolvedValue(undefined);
    (CreateCsv.unificateFiles as jest.Mock).mockResolvedValue(undefined);

    // Mock update method of sftpProvider
    sftpProviderMock.update.mockResolvedValue({});

    dataloadProviderPricesMock.getPrices.mockResolvedValue([
      { CatentryPartNumber: '456' },
    ]);
 
    // Call the method
    jest.spyOn(productInventoryUC, 'dataLoadConfiguration');
    await productInventoryUC.dataLoadConfiguration(dataCategories, path, pathB2b);
 
    // Assertions
    expect(sftpProviderMock.update).toHaveBeenCalledWith(expect.any(String), path);
    expect(CreateCsv.createCsv).toHaveBeenCalledWith(
      expect.any(Array),
      expect.any(String),
      expect.any(Array),
      'CatalogEntryInventory',
      'product_inventory_0',
    );
    expect(CreateCsv.unificateFiles).toHaveBeenCalledWith(
      'product_inventory_0',
      expect.any(String),
    );
  });
});