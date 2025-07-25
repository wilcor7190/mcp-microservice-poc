import { Model } from 'mongoose';
import { IParamProvider } from '../param.provider';
import { ParamProvider } from './param.provider.impl';
import { IParam, ParamModel } from '@claro/generic-models-library';
import databaseConfig from 'src/common/configuration/database.config';


const paramMockResponse = {
  id_param: '123456',
  description: 'Mock param',
  createdUser: '01/01/2022',
  updatedUser: '01/01/2023',
  createdAt: '02/02/2022',
  updatedAt: '03/03/2023',
  values: '',
};

// Mock the Mongoose Model
const paramModelMock: Model<ParamModel> = {
  find: jest.fn().mockResolvedValue(paramMockResponse),
  findOne: jest.fn().mockResolvedValue(paramMockResponse),

  findOneAndUpdate: jest.fn().mockResolvedValue(paramMockResponse),
  insertMany: jest.fn().mockResolvedValue(true),
  countDocuments: jest.fn().mockResolvedValue(10),
} as any;

describe('ParamProvider', () => {
  let paramProvider: IParamProvider;

  beforeEach(() => {
    const mockServiceTracing = { createServiceTracing: jest.fn() }; 
    paramProvider = new ParamProvider(paramModelMock, mockServiceTracing);
  });
  
  describe('onModuleInit', () => {
    it('should call loadParams and watchChanges when called', async () => {
      // Mocking loadParams and watchChanges
      
      const watchChangesSpy = jest.spyOn(paramProvider, 'watchChanges').mockImplementation();

      await paramProvider.onModuleInit();

      
      expect(watchChangesSpy).toHaveBeenCalled();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return true when createParams', async () => {
    const params: IParam[] = [
      {
        id_param: '',
        description: '',
        createdUser: '',
        updatedUser: '',
        createdAt: '',
        updatedAt: '',
        values: '',
      },
    ];
    const response = await paramProvider.createParams(params);

    expect(paramModelMock.insertMany).toHaveBeenCalled();
    expect(response).toEqual(true);
  });

  it('should return params total', async () => {
    const response = await paramProvider.getTotal('params');

    expect(paramModelMock.countDocuments).toHaveBeenCalled();
    expect(response).toEqual(10);
  });
  

  it('should return params updated', async () => {
    const params: IParam = {
      id_param: '123456',
      description: 'Mock param',
      createdUser: '01/01/2022',
      updatedUser: '01/01/2023',
      createdAt: '02/02/2022',
      updatedAt: '03/03/2023',
      values: '',
    };

    const response = await paramProvider.updateParam(params);

    expect(paramModelMock.findOneAndUpdate).toHaveBeenCalled();
    expect(response.id_param).toEqual(paramMockResponse.id_param);
  });

it('should return params by id', async () => {
    const response = await paramProvider.getParamByIdParam('123456');

    expect(paramModelMock.findOne).toHaveBeenCalledWith({ id_param: '123456' });
    expect(response.id_param).toEqual(paramMockResponse.id_param);
  });
});
