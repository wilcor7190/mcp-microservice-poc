import { Model } from 'mongoose';
import { IParamProvider } from '../param.provider';
import { ParamProvider } from './param.provider.impl';
import { ParamModel } from '@claro/generic-models-library';

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
    paramProvider = new ParamProvider(paramModelMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return params total', async () => {
    const response = await paramProvider.getTotal('params');

    expect(paramModelMock.countDocuments).toHaveBeenCalled();
    expect(response).toEqual(10);
  });

});
