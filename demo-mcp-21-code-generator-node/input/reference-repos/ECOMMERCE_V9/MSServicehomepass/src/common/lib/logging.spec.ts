import { Test, TestingModule } from '@nestjs/testing';
import Logging from './logging';
import { Etask } from '../utils/enums/task.enum';
import { ELevelsErrors } from '../utils/enums/logging.enum';

describe('LoggingService', () => {
  let service: Logging;
  let loggerMock: any;

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
    const message = 'This is a test log message';
    const log = service.write(message, Etask.LOAD_MESSAGE, ELevelsErrors.INFO);
    expect(log).toBeUndefined();
  });
});

describe('write', () => {
  let service: Logging;
  let loggerMock: any;

  beforeEach(() => {
    loggerMock = {
      log: jest.fn(),
    };
    service = new Logging(loggerMock);
  });

  it('should call logOutput with correct parameters', () => {
    const spy = jest.spyOn(service, 'write').mockImplementation(() => {});
    service.write('test message', Etask.CREATE, ELevelsErrors.INFO, { request: 'request' }, { response: 'response' });
    expect(spy).toHaveBeenCalledWith('test message', Etask.CREATE, ELevelsErrors.INFO, { request: 'request' }, { response: 'response' });
  });
});
