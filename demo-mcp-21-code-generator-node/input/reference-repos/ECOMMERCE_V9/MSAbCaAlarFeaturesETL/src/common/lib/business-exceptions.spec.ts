import { Test, TestingModule } from '@nestjs/testing';
import {
  BusinessException,
  ErrorLegacyException,
  InternalServerException,
  LegacyException,
  SuccessfulBusinessException,
} from './business-exceptions';
import { EmessageMapping } from '../utils/enums/message.enum';

describe('BusinessException Class', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [BusinessException, LegacyException],
    }).compile();
  });

  it('should create BusinessException', async () => {
    const result = new BusinessException(400, 'Description', {
      codMessage: EmessageMapping.DEFAULT_ERROR,
    });
    expect(result).toBeDefined();
    expect(result.code).toBe(400);
  });
  it('should create LegacyException', async () => {
    const result = new LegacyException(
      '400',
      'Description',
      EmessageMapping.DEFAULT_ERROR,
      null,
    );
    expect(result).toBeDefined();
    expect(result.code).toBe('400');
  });
  it('should create ErrorLegacyException', async () => {
    const result = new ErrorLegacyException(400, 'Description');
    expect(result.status).toBe(400);
  });
  it('should create SuccessfulBusinessException', async () => {
    const result = new SuccessfulBusinessException(
      'test@test.com',
      'Description',
      '',
      EmessageMapping.CHANNEL_ERROR,
    );
    expect(result.Email).toBe('test@test.com');
  });
  it('should create InternalServerException', async () => {
    const result = new InternalServerException(400, 'Description');
    expect(result.status).toBe(400);
  });
});
