import { Test, TestingModule } from "@nestjs/testing"
import { ISftpProvider } from "../../../../data-provider/sftp.provider"
import { dataCategories } from "../../../../../test/response-dummy"
import { IServiceErrorUc } from "../../resource/service-error.resource.uc"
import { AttributesDictionaryUC } from "./attributes-dictionary.uc.impl"
import CreateCsv from '../../../../common/utils/createCsv';
jest.mock('../../../../common/utils/createCsv'); 

const sftpProviderMock = {
  readFileImg: jest.fn(),
  update: jest.fn(),
};
 
const serviceErrorUcMock = {
  // Mock necessary methods here if needed
};
 
 
describe('AttributesDictionaryUC', () => {
  let attributesDictionaryUC: AttributesDictionaryUC;
 
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttributesDictionaryUC,
        { provide: ISftpProvider, useValue: sftpProviderMock },
        { provide: IServiceErrorUc, useValue: serviceErrorUcMock },
      ],
    }).compile();
 
    attributesDictionaryUC = module.get<AttributesDictionaryUC>(AttributesDictionaryUC);
  });
 
  afterEach(() => {
    jest.clearAllMocks();
  });
 
  it('should call the necessary methods to create dataload', async () => {
    const path = '/path/to/dataload.csv';
    const pathB2b = '/path/to/dataload.csv';
  
    (CreateCsv.createCsv as jest.Mock).mockResolvedValue(undefined);
    (CreateCsv.unificateFiles as jest.Mock).mockResolvedValue(undefined);
 
    // Call the method
    jest.spyOn(attributesDictionaryUC, 'dataLoadConfiguration');
    await attributesDictionaryUC.dataLoadConfiguration(dataCategories, path, pathB2b);
 
    // Assertions
    expect(sftpProviderMock.update).toHaveBeenCalledWith(expect.any(String), path);
    expect(CreateCsv.createCsv).toHaveBeenCalledWith(
      expect.any(Array),
      expect.any(String),
      expect.any(Array),
      'AttributeDictionaryAttributeAllowedValues',
      'attribute_dictionary_0',
    );
    expect(CreateCsv.unificateFiles).toHaveBeenCalledWith(
      'attribute_dictionary_0',
      expect.any(String),
    );
  });
});