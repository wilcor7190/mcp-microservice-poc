import { BusinessException } from './business-exceptions';
import { EmessageMapping } from '../utils/enums/message.enum';
import { Test } from '@nestjs/testing';

describe('BusinessException Class', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      providers: [BusinessException],
    }).compile();

    const result = new BusinessException(400, 'Description', false, { codMessage: EmessageMapping.DEFAULT_ERROR });
    expect(module).toBeDefined();
    expect(result).toBeDefined();
    expect(result.code).toBe(400);
  });
});
