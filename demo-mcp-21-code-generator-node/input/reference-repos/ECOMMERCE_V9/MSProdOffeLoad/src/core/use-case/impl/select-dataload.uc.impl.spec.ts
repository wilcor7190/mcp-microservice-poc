import { Test, TestingModule } from '@nestjs/testing';
import { SelectDataloadUC } from './select-dataload.uc.impl';
import { IProductDataUC } from '../product-data/product-data.uc';
import { IAttributesProductsUC } from '../attributes-products/attributes-products.uc';
import { IAttributesDictionaryUC } from '../attributes-dictionary/attributes-dictionary.uc';
import { IAttachmentsDataUC } from '../attachments-data/attachments-data.uc';
import { IProductInventoryUC } from '../product-inventory/product-inventory.uc';
import { IPriceListUC } from '../price-list/price-list.uc';
import { IServiceTracingUc } from '../resource/service-tracing.resource.uc';
import {
  dataCategories,
  dataEquipmentDummy,
} from '../../../../test/response-dummy';

// Mock dependencies
const productDataUcMock = {
  dataLoadConfiguration: jest.fn(),
};

const attributesProductsUcMock = {
  dataLoadConfiguration: jest.fn(),
};

const attributesDictionaryUcMock = {
  dataLoadConfiguration: jest.fn(),
};

const attachmentsDataUcMock = {
  dataLoadConfiguration: jest.fn(),
};

const productInventoryUcMock = {
  dataLoadConfiguration: jest.fn(),
};

const priceListUcMock = {
  dataLoadConfiguration: jest.fn(),
};

const serviceTracingUcMock = {
  createServiceTracing: jest.fn(),
};

describe('SelectDataloadUC', () => {
  let selectDataloadUC: SelectDataloadUC;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SelectDataloadUC,
        { provide: IProductDataUC, useValue: productDataUcMock },
        { provide: IAttributesProductsUC, useValue: attributesProductsUcMock },
        {
          provide: IAttributesDictionaryUC,
          useValue: attributesDictionaryUcMock,
        },
        { provide: IAttachmentsDataUC, useValue: attachmentsDataUcMock },
        { provide: IProductInventoryUC, useValue: productInventoryUcMock },
        { provide: IPriceListUC, useValue: priceListUcMock },
        { provide: IServiceTracingUc, useValue: serviceTracingUcMock },
      ],
    }).compile();

    selectDataloadUC = module.get<SelectDataloadUC>(SelectDataloadUC);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call the necessary methods to create dataload with Product-Data', async () => {
    const req = {
      dataload: 'Product-Data',
    };

    productDataUcMock.dataLoadConfiguration.mockResolvedValue({
      dataCategories,
      req,
    });
    // Call the method
    await selectDataloadUC.selectDataLoad(dataCategories, req);

    // Assertions
    expect(productDataUcMock.dataLoadConfiguration).toHaveBeenCalled();
  });
  it('should call the necessary methods to create dataload with Attributes-Products', async () => {
    const req = {
      dataload: 'Attributes-Products',
    };

    attributesProductsUcMock.dataLoadConfiguration.mockResolvedValue({
      dataEquipmentDummy,
      req,
    });

    // Call the method
    await selectDataloadUC.selectDataLoad(dataCategories, req);

    // Assertions
    expect(attributesProductsUcMock.dataLoadConfiguration).toHaveBeenCalled;
  });
  it('should call the necessary methods to create dataload with Attributes-Dictionary', async () => {
    const req = {
      dataload: 'Attributes-Dictionary',
    };

    attributesDictionaryUcMock.dataLoadConfiguration.mockResolvedValue({
      dataCategories,
      req,
    });

    // Call the method
    await selectDataloadUC.selectDataLoad(dataCategories, req);

    // Assertions
    expect(attributesDictionaryUcMock.dataLoadConfiguration).toHaveBeenCalled;
  });
  it('should call the necessary methods to create dataload with Attachments-Data', async () => {
    const req = {
      dataload: 'Attachments-Data',
    };

    attachmentsDataUcMock.dataLoadConfiguration.mockResolvedValue({
      dataCategories,
      req,
    });

    // Call the method
    await selectDataloadUC.selectDataLoad(dataCategories, req);

    // Assertions
    expect(attachmentsDataUcMock.dataLoadConfiguration).toHaveBeenCalled;
  });
  it('should call the necessary methods to create dataload with Product-Inventory', async () => {
    const req = {
      dataload: 'Product-Inventory',
    };

    productInventoryUcMock.dataLoadConfiguration.mockResolvedValue({
      dataCategories,
      req,
    });

    // Call the method
    await selectDataloadUC.selectDataLoad(dataCategories, req);

    // Assertions
    expect(productInventoryUcMock.dataLoadConfiguration).toHaveBeenCalled;
  });
  it('should call the necessary methods to create dataload with Price-List', async () => {
    const req = {
      dataload: 'Price-List',
    };

    priceListUcMock.dataLoadConfiguration.mockResolvedValue({
      dataCategories,
      req,
    });

    // Call the method
    await selectDataloadUC.selectDataLoad(dataCategories, req);

    // Assertions
    expect(priceListUcMock.dataLoadConfiguration).toHaveBeenCalled;
  });
  it('should call the necessary methods to create dataload with default', async () => {
    const req = {
      dataload: 'default',
    };
    // Call the method
    await selectDataloadUC.selectDataLoad(dataCategories, req);

    // Assertions
    expect(serviceTracingUcMock.createServiceTracing).toHaveBeenCalled;
  });
});
