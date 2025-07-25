import { Test, TestingModule } from '@nestjs/testing';
import Logging from './logging';
import { Etask } from '../utils/enums/taks.enum';
import { responseDummy } from '../../../test/response-dummy';

describe('LoggingService', () => {
  let service: Logging;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        providers: [Logging],
    }).compile();

    service = module.get<Logging>(Logging);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
      
  it('should log a message', () => {
    const message = 'Inicia consumo de endpoint /manual';
    const log = service.write(message, Etask.LOAD_MESSAGE, false, { request: "" }, { response: responseDummy });
    expect(log).toBeUndefined();
  });
});


describe('write', () => {
  let service: Logging;
  let loggerMock: any;

  beforeEach(() => {
    loggerMock = {
      log: jest.fn()
    };
    service = new Logging(loggerMock);
  });

  it('should call logOutput with correct parameters', () => {
    const spy = jest.spyOn(service, 'write').mockImplementation(() => { });
    service.write('test message', Etask.CONSUMED_SERVICE, true, { request: "" }, { response: responseDummy });
    expect(spy).toHaveBeenCalledWith('test message', Etask.CONSUMED_SERVICE, true, { request: "" }, { response: responseDummy });
  });
});