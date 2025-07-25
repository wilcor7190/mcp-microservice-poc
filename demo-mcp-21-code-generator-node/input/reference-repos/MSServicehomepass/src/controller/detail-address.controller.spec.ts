import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DetailAddressController } from './detailAddress.controller';
import { IDetailAddress } from './service/detailAddress.service';
import { DetailAddress } from './service/impl/detail-address.service.impl';
import { AppModule } from 'src/app.module';
import { CommonModule } from 'src/common/common.module';
import { DataProviderModule } from 'src/data-provider/data-provider.module';
import { CoreModule } from 'src/core/core.module';
import { ControllerModule } from './controller.module';
import { GlobalValidateService } from './service/resources/impl/globalValidate.service.impl';
import { IGlobalValidateService } from './service/resources/globalValidate.service';
import {
  BodyExample,
  BodyFakeAddressNotFound,
  BodyFakeDataValidation,
  DetailAddress_200,
  DetailAddress_201,
  DetailAddress_400,
} from 'src/mockup/DetailAddress/detail-address.mock';
import rTracer = require('cls-rtracer');

jest.setTimeout(15000);
describe('DetailAddressController', () => {
  
  let service: IDetailAddress;
  let mockService: IDetailAddress;
  let controller: DetailAddressController;
  const mockvalidateChannel = {
    validateChannel: jest.fn()
  };
  beforeEach(async () => {
    mockService = {
      consultDetailsAddres: jest.fn(),
    };
    const mockDetailAddress = {
      consultDetailsAddres: jest.fn()
    }
    const module = await Test.createTestingModule({
      controllers: [DetailAddressController],
      providers: [
        { provide: IDetailAddress, useValue: mockDetailAddress },
        { provide: IGlobalValidateService, useValue: mockvalidateChannel },
      ]
    }).compile();
    controller = module.get<DetailAddressController>(DetailAddressController);
    service = module.get<IDetailAddress>(IDetailAddress);
  });


  describe('consultDetailsAddres endpoint', () => {
    it('should return 201', async () => {
      jest.spyOn(service, 'consultDetailsAddres').mockImplementation(() => Promise.resolve(DetailAddress_200));
      const result = await controller.consultDetailsAddres(`EC9_B2C`,'',BodyExample);
      expect(result).toBe(DetailAddress_200);
      expect(result.status).toBe(200);
    });

    it('should return 201 address not found', async () => {
      jest.spyOn(service, 'consultDetailsAddres').mockImplementation(() => Promise.resolve(DetailAddress_201));
      const result = await controller.consultDetailsAddres(`EC9_B2C`,'',BodyFakeAddressNotFound);
      expect(result).toBe(DetailAddress_201);
      expect(result.status).toBe(201);
    });

    it('should return 400 channel validation', async () => {
      jest.spyOn(service, 'consultDetailsAddres').mockImplementation(() => Promise.resolve(DetailAddress_400));
      const result = await controller.consultDetailsAddres(``,'',BodyFakeAddressNotFound);
      expect(result).toBeDefined();
      expect(result.status).toBe(400);
    });

    it('should return 400 data validation', async () => {
      jest.spyOn(service, 'consultDetailsAddres').mockImplementation(() => Promise.resolve(DetailAddress_400));
      const result = await controller.consultDetailsAddres(`EC9_B2C`,'',BodyFakeAddressNotFound);
      expect(result).toBe(DetailAddress_400);
      expect(result.status).toBe(400);
    });
  });
});
