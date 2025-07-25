import { Test } from '@nestjs/testing';
import { SkuSondServiceImpl } from './sku-sond.service.impl';
import { IGlobalValidateIService } from '../globalValidate.service';
import { ISKUSondUc } from 'src/core/use-case/sku-sond.uc';

describe('SkuSondService', () => {
  let skuSondService: SkuSondServiceImpl;
  let globalValidateServ: IGlobalValidateIService;
  let skuSondUc: ISKUSondUc;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SkuSondServiceImpl,
        {
          provide: IGlobalValidateIService,
          useValue: {
            validateChannel: jest.fn(),
          },
        },
        {
          provide: ISKUSondUc,
          useValue: {
            getSKUSond: jest.fn(),
          },
        },
      ],
    }).compile();

    skuSondService = moduleRef.get<SkuSondServiceImpl>(SkuSondServiceImpl);
    globalValidateServ = moduleRef.get<IGlobalValidateIService>(IGlobalValidateIService);
    skuSondUc = moduleRef.get<ISKUSondUc>(ISKUSondUc);
  });

  describe('getInfoSku', () => {
    it('should call validateChannel and getSKUSond', async () => {
      // Arrange
      const sku = 'test-sku';
      const salesType = 'test-salesType';
      const channel = 'test-channel';

      const validateChannelSpy = jest.spyOn(globalValidateServ, 'validateChannel');
      const getSKUSondSpy = jest.spyOn(skuSondUc, 'getSKUSond');

      // Act
      await skuSondService.getInfoSku(sku, salesType, channel);

      // Assert
      expect(validateChannelSpy).toHaveBeenCalledWith(channel);
      expect(getSKUSondSpy).toHaveBeenCalledWith(sku, salesType, channel);
    });

    it('should throw an error and rethrow it', async () => {
      // Arrange
      const sku = 'test-sku';
      const salesType = 'test-salesType';
      const channel = 'test-channel';
      const error = new Error('Test error');

      jest.spyOn(globalValidateServ, 'validateChannel').mockRejectedValue(error);

      // Act & Assert
      await expect(skuSondService.getInfoSku(sku, salesType, channel)).rejects.toThrow(error);
    });
  });
});