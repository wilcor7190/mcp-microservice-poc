import { Test } from '@nestjs/testing';
import ApmService from './apm-service';
import Logging from '../lib/logging';

jest.mock('@claro/general-utils-library', () => ({
  startSpan: jest.fn().mockImplementation(() => ({
    end: jest.fn(),
  })),
  captureError: jest.fn(),
  startTransaction: jest.fn(),
}));
describe('apm-service Class', () => {
  let apmService: ApmService;
  jest.spyOn(Logging.prototype, 'write').mockImplementation(jest.fn());
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ApmService],
    }).compile();

    apmService = module.get<ApmService>(ApmService);
  });

  describe('Methods', () => {
    it('captureError', async () => {
      await ApmService.captureError({});
      expect(Logging.prototype.write).toHaveBeenCalled();
    });
    it('startSpan', async () => {
      ApmService.startSpan('naem', {}, {}, {});
      expect(Logging.prototype.write).toHaveBeenCalled();
    });
    it('startTransaction', async () => {
      await ApmService.startTransaction({});
      expect(Logging.prototype.write).toHaveBeenCalled();
    });
  });
});
