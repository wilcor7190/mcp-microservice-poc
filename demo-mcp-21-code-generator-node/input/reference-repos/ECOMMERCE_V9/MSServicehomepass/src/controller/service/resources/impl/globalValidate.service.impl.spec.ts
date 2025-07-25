import { Test, TestingModule } from '@nestjs/testing';

import { BusinessException } from '../../../../common/lib/business-exceptions';
import { EmessageMapping } from '../../../../common/utils/enums/message.enum';
import GeneralUtil from '../../../../common/utils/generalUtil';
import { HttpStatus } from '@nestjs/common';
import { GlobalValidateService } from './globalValidate.service.impl';

jest.mock('../../../../common/utils/generalUtil'); // Mockear GeneralUtil

describe('GlobalValidateService', () => {
  let service: GlobalValidateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GlobalValidateService],
    }).compile();

    service = module.get<GlobalValidateService>(GlobalValidateService);
  });

  it('debería ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('validateChannel', () => {
    it('debería retornar true si el canal es válido', () => {
      const channel = 'valid_channel';
      // Simulamos que el canal es válido
      GeneralUtil.validateChannel = jest.fn().mockReturnValue(true);

      const result = service.validateChannel(channel);
      expect(result).toBe(true);
    });


    it('debería llamar a GeneralUtil.validateChannel con el canal correcto', () => {
      const channel = 'valid_channel';
      GeneralUtil.validateChannel = jest.fn().mockReturnValue(true);

      service.validateChannel(channel);

      expect(GeneralUtil.validateChannel).toHaveBeenCalledWith(channel);
    });
  });
});
