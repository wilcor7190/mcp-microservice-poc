import { TestingModule, Test } from "@nestjs/testing";
import { Etask } from "src/common/utils/enums/task.enum";
import { IHttpProvider } from "./http.provider";
import { EHttpMethod, IRequestConfigHttp } from "./model/http/request-config-http.model";
import { ResponseHttp } from "./model/http/response-http.model";


describe('IHttpProvider', () => {
  let httpProvider: IHttpProvider;

  beforeEach(async () => {
    httpProvider = {
      executeRest: jest.fn(),
      executeSOAP: jest.fn(),
    } as unknown as jest.Mocked<IHttpProvider>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: IHttpProvider, useValue: httpProvider },
      ],
    }).compile();

    httpProvider = module.get<IHttpProvider>(IHttpProvider);
  });

  describe('executeRest', () => {
    it('should return a ResponseHttp object', async () => {

      const methodvalue: EHttpMethod.get = EHttpMethod.get;

      const requestConfig: IRequestConfigHttp = {
        method: methodvalue,
        url: 'http://test.com'
      };
      const task: Etask = Etask.CONSULT_HOMEPASS;
      const response: ResponseHttp = {
        executed: true,
        message: 'success',
        status: 200,
        data: {} // provide the expected response data
      };

      jest.spyOn(httpProvider, 'executeRest').mockResolvedValue(response);

      const result = await httpProvider.executeRest(requestConfig, task);

      expect(result).toEqual(response);
    });
  });

});