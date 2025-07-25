import { Test, TestingModule } from "@nestjs/testing"
import { ISftpProvider } from "../../../../data-provider/sftp.provider"
import { dataEquipmentDummy } from "../../../../../test/response-dummy"
import { IServiceErrorUc } from "../../resource/service-error.resource.uc"
import { IServiceTracingUc } from "../../resource/service-tracing.resource.uc"
import { AttributesProductsUC } from "./attributes-products.uc.impl"
import CreateCsv from '../../../../common/utils/createCsv';
jest.mock('../../../../common/utils/createCsv');

const serviceTracingUcMock = {
  createServiceTracing: jest.fn(),
};


const sftpProviderMock = {
  readFileImg: jest.fn(),
  update: jest.fn(),
};

const serviceErrorUcMock = {
  // Mock necessary methods here if needed
};


describe('AttributesProductsUC', () => {
  let attributesProductsUC: AttributesProductsUC;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttributesProductsUC,
        { provide: ISftpProvider, useValue: sftpProviderMock },
        { provide: IServiceErrorUc, useValue: serviceErrorUcMock },
        { provide: IServiceTracingUc, useValue: serviceTracingUcMock },
      ],
    }).compile();

    attributesProductsUC = module.get<AttributesProductsUC>(AttributesProductsUC);
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

    // Call the method
    jest.spyOn(attributesProductsUC, 'dataLoadConfiguration');
    await attributesProductsUC.dataLoadConfiguration(dataEquipmentDummy, path, pathB2b);

    // Assertions
    expect(sftpProviderMock.update).toHaveBeenCalledWith(expect.any(String), path);
    expect(CreateCsv.createCsv).toHaveBeenCalledWith(
      expect.any(Array),
      expect.any(String),
      expect.any(Array),
      'CatalogEntryAttributeDictionaryAttributeRelationship',
      'attribute_product_0',
    );
    expect(CreateCsv.unificateFiles).toHaveBeenCalledWith(
      'attribute_product_0',
      expect.any(String),
    );
  });
});