import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { IServiceTracingUc } from "../../core/use-case/resource/service-tracing.resource.uc";
import { dataDisponibilityDummy, dataPricesDummy } from "../../../test/response-dummy";
import { ECategoriesDataload } from "../../common/utils/enums/categories-dataload.enum";
import { DisponibilityModel } from "../model/dataload/disponibility.model";
import { PriceListEquModel } from "../model/dataload/price-equ.model";
import { PriceListHomeModel } from "../model/dataload/price-home.model";
import { PriceListPosModel } from "../model/dataload/price-pos.model";
import { PriceListPreModel } from "../model/dataload/price-pre.model";
import { PriceListTecModel } from "../model/dataload/price-tec.model";
import { DataloadProviderPricesImpl } from "./dataload-prices.provider.impl";
import databaseConfig from "../../common/configuration/database.config";

const serviceTracingUcMock = {
  createServiceTracing: jest.fn(),
};
 
 
describe('DataloadProviderPricesImpl', () => {
  let dataloadProviderPricesImpl: DataloadProviderPricesImpl;
 
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataloadProviderPricesImpl,
        { provide: getModelToken(PriceListEquModel.name, databaseConfig.databasePrices), useValue: {
          find: jest.fn().mockReturnValue(dataPricesDummy)
        }},
        { provide: getModelToken(DisponibilityModel.name, databaseConfig.databaseDisponibility), useValue: {
          find: jest.fn().mockReturnValue(dataDisponibilityDummy)
        }},
        { provide: getModelToken(PriceListTecModel.name, databaseConfig.databasePrices), useValue: {
          find: jest.fn().mockReturnValue(dataPricesDummy)
        }},
        { provide: getModelToken(PriceListPreModel.name, databaseConfig.databasePrices), useValue: {
          find: jest.fn().mockReturnValue(dataPricesDummy)
        }},
        { provide: getModelToken(PriceListPosModel.name, databaseConfig.databasePrices), useValue: {
          find: jest.fn().mockReturnValue(dataPricesDummy)
        }},
        { provide: getModelToken(PriceListHomeModel.name, databaseConfig.databasePrices), useValue: {
          find: jest.fn().mockReturnValue(dataPricesDummy)
        }},
        { provide: IServiceTracingUc, useValue: serviceTracingUcMock },
        
    
      ],
    }).compile();
 
    dataloadProviderPricesImpl = module.get<DataloadProviderPricesImpl>(DataloadProviderPricesImpl);
  });
 
  afterEach(() => {
    jest.clearAllMocks();
  });
 
  it('should call the necessary methods to create dataload', async () => {
 
    // Call the method
    await dataloadProviderPricesImpl.getPrices(ECategoriesDataload.EQUIPMENT, "PO_Tec7016853");
    await dataloadProviderPricesImpl.findDisponibility();
 
  });
});