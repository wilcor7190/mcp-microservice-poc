import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { HomepassController } from './homepass.controller';
import { IHomePassService } from './service/homepass.service';
import { HomePass } from './service/impl/homepass.service.impl';
import { IGlobalValidateService } from './service/resources/globalValidate.service';
import { GlobalValidateService } from './service/resources/impl/globalValidate.service.impl';
import { AppModule } from 'src/app.module';
import { CommonModule } from 'src/common/common.module';
import { DataProviderModule } from 'src/data-provider/data-provider.module';
import { CoreModule } from 'src/core/core.module';
import { ControllerModule } from './controller.module';
import {
  BodyExampleMigratedUser,
  BodyExampleNotMigratedUser,
  BodyFakeDataValidation,
  HomePass_200,
  HomePass_201,
  HomePass_400,
} from 'src/mockup/homepass/home-pass.mock';
import rTracer = require('cls-rtracer');
import { HomePassDTO } from './dto/hompass/hompass.dto';

jest.setTimeout(15000);
describe('HomepassController', () => {
  let service: IHomePassService;
  let mockService: IHomePassService;
  let controller: HomepassController;
  let dtoBodyNotMigratedUser: HomePassDTO;
  const mockvalidateChannel = {
    validateChannel: jest.fn()
  };
  beforeEach(async () => {
    mockService = {
      consultHomePass: jest.fn(),
    };
    const module = await Test.createTestingModule({
      controllers: [HomepassController],
      providers: [
        { provide: IHomePassService, useValue: mockService },
        { provide: IGlobalValidateService, useValue: mockvalidateChannel },
      ]
    }).compile();
    controller = module.get<HomepassController>(HomepassController);
    service = module.get<IHomePassService>(IHomePassService);
  });

  describe('consultHomePass endpoint', () => {
    it('should return 200', async () => {
      jest.spyOn(service, 'consultHomePass').mockImplementation(() => Promise.resolve(HomePass_200));
      const result = await controller.consultHomePass(`EC9_B2C`, BodyExampleNotMigratedUser);
      expect(result).toBe(HomePass_200);
      expect(result.status).toBe(200);
    });

    it('should return 201 client not suported', async () => {
      jest.spyOn(service, 'consultHomePass').mockImplementation(() => Promise.resolve(HomePass_201));
      const result = await controller.consultHomePass(`EC9_B2C`, BodyExampleMigratedUser);
      expect(result).toBe(HomePass_201);
      expect(result.status).toBe(201);
    });

    it('should return 400 channel validation', async () => {
      jest.spyOn(service, 'consultHomePass').mockImplementation(() => Promise.resolve(HomePass_400));
      const result = await controller.consultHomePass(``, BodyExampleMigratedUser);
      expect(result).toBe(HomePass_400);
      expect(result.status).toBe(400);
    });

    it('should return 400 data validation', async () => {
      jest.spyOn(service, 'consultHomePass').mockImplementation(() => Promise.resolve(HomePass_400));
      const result = await controller.consultHomePass(`EC9_B2C`, BodyFakeDataValidation);
      expect(result).toBe(HomePass_400);
      expect(result.status).toBe(400);
    });
  });
});
