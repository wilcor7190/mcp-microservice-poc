import { Cache } from 'cache-manager';
import { IParam , IServiceError} from '@claro/generic-models-library';
import { IParamProvider } from 'src/data-provider/param.provider';
import { IServiceErrorUc } from '../service-error.resource.uc';
import { ParamUcimpl } from './param.resource.uc.impl';
import { ResponsePaginator } from 'src/controller/dto/response-paginator.dto';

describe('ParamUcimpl', () => {
  let paramUcimpl: ParamUcimpl;
  let cacheManagerMock: jest.Mocked<Cache>;
  let paramProviderMock: jest.Mocked<IParamProvider>;
  let serviceErrorUcMock: jest.Mocked<IServiceErrorUc>;

  beforeEach(() => {
    cacheManagerMock = {
    } as jest.Mocked<Cache>;

    paramProviderMock = {
      createParams: jest.fn().mockResolvedValue(true),
      getParams: jest.fn().mockResolvedValue([]),
      getTotal: jest.fn().mockResolvedValue(0),
      getParamByIdParam: jest.fn().mockResolvedValue(null),
      updateParam: jest.fn().mockResolvedValue(null),
      setLoadTime: jest.fn().mockResolvedValue(undefined),
      getParamByIdParamPrices: jest.fn().mockResolvedValue(null),
      setLoadTimeExcp: jest.fn().mockResolvedValue(undefined),
      getFeaturesEnabled: jest.fn().mockResolvedValue([]),
    } as jest.Mocked<IParamProvider>;

    serviceErrorUcMock = {
      createServiceError: jest.fn(),
      getServiceErrors: jest.fn().mockResolvedValue({} as ResponsePaginator<IServiceError>),
    } as jest.Mocked<IServiceErrorUc>;

    paramUcimpl = new ParamUcimpl(cacheManagerMock, paramProviderMock, serviceErrorUcMock);
  });

  describe('getMessages', () => {
    it('should return the params', () => {
      // Arrange
      const params: IParam[] = [
      ];

      ParamUcimpl.params = params;

      // Act
      const result = ParamUcimpl.getMessages;

      // Assert
      expect(result).toEqual(params);
    });
  });

});
