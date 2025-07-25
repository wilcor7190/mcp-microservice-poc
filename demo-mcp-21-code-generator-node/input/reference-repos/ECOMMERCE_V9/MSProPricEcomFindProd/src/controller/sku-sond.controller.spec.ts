/*
https://docs.nestjs.com/fundamentals/testing#unit-testing
*/

import { Test, TestingModule } from '@nestjs/testing';
import { SKUSondController } from './sku-sond.controller';
import { ISkuSondService } from './service/sku-sond.service';
import { SkuQueryDto } from './dto/sku/sku.dto';
import Logging from 'src/common/lib/logging';

describe('SkuSondController', () => {
  let skuSondController: SKUSondController;
  let skuSondService: ISkuSondService;


  const mockSkuSondService = {
    getInfoSku: jest.fn(),
  };

  const mockLogging = {
    write: jest.fn(),
  };


  beforeEach(async () => {

    skuSondService = {
      getInfoSku: jest.fn(),
    } as unknown as jest.Mocked<ISkuSondService>;

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [SKUSondController], // Add
      providers: [
        { provide: ISkuSondService, useValue: skuSondService },
        { provide: Logging, useValue: mockLogging },
      ],   // Add
    }).compile();
    skuSondController = moduleRef.get<SKUSondController>(SKUSondController);
    skuSondService = moduleRef.get<ISkuSondService>(ISkuSondService);
  });

  it('should be defined', () => {
    expect(skuSondController).toBeDefined();
  });

  describe('SkuSond', () => {
    it('should call skuService.getInfoSku with the correct parameters', async () => {
      const skuQuery: SkuQueryDto = { sku: '749750', salesType: 'PRE' };
      const channel = 'test-channel';
      const result = { sku: '749750', salesType: 'PRE' };

      // Mock the getInfoSku method to return the expected result
      jest.spyOn(skuSondService, 'getInfoSku').mockImplementation(() => Promise.resolve(result));

      // Call the controller method
      const response = await skuSondController.SkuSond(skuQuery, channel);

      // Assert the response
      expect(response).toEqual(result);
    });

  });
});
