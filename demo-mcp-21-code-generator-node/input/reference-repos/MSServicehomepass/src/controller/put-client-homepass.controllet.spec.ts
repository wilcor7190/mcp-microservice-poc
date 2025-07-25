import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { CommonModule } from 'src/common/common.module';
import { DataProviderModule } from 'src/data-provider/data-provider.module';
import { CoreModule } from 'src/core/core.module';
import { ControllerModule } from './controller.module';
import { IGlobalValidateService } from './service/resources/globalValidate.service';
import { GlobalValidateService } from './service/resources/impl/globalValidate.service.impl';
import { PutClientHomepassController } from './putClientHomepass.controller';
import { IPutClientHomepass } from './service/putClientHomepass.service';
import { PutClientHomepass } from './service/impl/putClientHomepass.service.impl';
import rTracer = require('cls-rtracer');
import {
  BodyExampleMigratedUser,
  BodyFakeDataValidation,
  BodyFakeIdNotFound,
  Client_400,
  PutClient_201,
  PutClient_400_DataValidation,
  PutClient_400_channelValidation,
} from 'src/mockup/PutClientHomepass/responsePutClientHomepass.mock';

describe('PutClientHomepassController', () => {
  let service: IPutClientHomepass;
  let mockService: IPutClientHomepass;
  let controller: PutClientHomepassController;

  beforeEach(async () => {
    mockService = {
      consultPutClientHomepass: jest.fn(),
    };
    const mockvalidateChannel = {
      validateChannel: jest.fn()
    };
    const module = await Test.createTestingModule({
      controllers: [PutClientHomepassController],
      providers: [
        { provide: IPutClientHomepass, useValue: mockService },
        { provide: IGlobalValidateService, useValue: mockvalidateChannel },
      ]
    }).compile();
    controller = module.get<PutClientHomepassController>(PutClientHomepassController);
    service = module.get<IPutClientHomepass>(IPutClientHomepass);
    
  });

  describe('consultPutClientHomepass endpoint', () => {
    it('should return 201 (isMigrateUser = true)', async () => {
      jest.spyOn(service, 'consultPutClientHomepass').mockImplementation(() => Promise.resolve(PutClient_201));
      const result = await controller.consultPutClientHomepass(`EC9_B2C`, BodyExampleMigratedUser);
      expect(result).toBe(PutClient_201);
      expect(result.status).toBe(201);
    });

    // it('should return 503 (isMigrateUser = false)', async () => {
    //   jest.spyOn(service, 'consultPutClientHomepass').mockImplementation(() => Promise.resolve(PutClient_201));
    //   return request(app.getHttpServer())
    //     .post('/v1/coverage/putClientHomepass')
    //     .set('channel', 'EC9_B2C')
    //     .send(BodyExampleMigratedUser)
    //     .expect(503)
    //     .expect((response) => expect(response.body.status).toEqual(503));
    // });

    it('should return 400 idCaseTcrm not found', async () => {
      jest.spyOn(service, 'consultPutClientHomepass').mockImplementation(() => Promise.resolve(Client_400));
      const result = await controller.consultPutClientHomepass(`EC9_B2C`, BodyFakeIdNotFound);
      expect(result).toBe(Client_400);
      expect(result.status).toBe(400);
    });

    it('should return 400 data validation', async () => {
      jest.spyOn(service, 'consultPutClientHomepass').mockImplementation(() => Promise.resolve(PutClient_400_DataValidation));
      const result = await controller.consultPutClientHomepass(`EC9_B2C`, BodyFakeDataValidation);
      expect(result).toBe(PutClient_400_DataValidation);
      expect(result.status).toBe(400);
    });

    it('should return 400 channel validation', async () => {
      jest.spyOn(service, 'consultPutClientHomepass').mockImplementation(() => Promise.resolve(PutClient_400_channelValidation));
      const result = await controller.consultPutClientHomepass(``, BodyFakeIdNotFound);
      expect(result).toBe(PutClient_400_channelValidation);
      expect(result.status).toBe(400);
    });
  });
});
