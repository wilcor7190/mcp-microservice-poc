import { INestApplication } from '@nestjs/common';
import { MessageController } from "./message.controller";
import { MessageService } from "./service/impl/message.service.impl";
import { Test, TestingModule } from '@nestjs/testing';
import { IMessageService } from '../controller/service/message.service';
import { AppModule } from '../app.module';
import { CommonModule } from '../common/common.module';
import { DataProviderModule } from '../data-provider/data-provider.module';
import { CoreModule } from '../core/core.module';
import { ControllerModule } from './controller.module';
import { IGlobalValidateIService } from './service/globalValidate.service';
import { GlobalValidateIService } from './service/impl/globalValidate.service.impl';
import Logging from '../common/lib/logging';
import * as request from 'supertest';
import { Etask } from '../common/utils/enums/taks.enum';
import { MessageControllerDummy, MessagesDummy } from '../../test/request-dummy';

//Se realiza una proyeccion del servicio del aplicativo
jest.mock('../controller/service/message.service.ts');

describe('MessageController Class', () => {
  let app: INestApplication;
  let messageController: MessageController
  let messageService: IMessageService;
  let log: Logging;
  let loggerMock: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [
        { provide: IMessageService, useClass: MessageService },
        { provide: IGlobalValidateIService, useClass: GlobalValidateIService },
        Logging
      ],
      imports: [AppModule, CommonModule, DataProviderModule, CoreModule, ControllerModule,]
    }).compile();
    loggerMock = {
      log: jest.fn()
    };
    log = new Logging(loggerMock);

    messageController = module.get<MessageController>(MessageController);
    messageService = module.get<IMessageService>(IMessageService);
    app = module.createNestApplication();
    log = module.get<Logging>(Logging);
    await app.init();
  })

  it('should be defined', () => {
    expect(messageController).toBeDefined();
  });


  describe('Method getMessages', () => {
    it('getMessages response 201', () => {
      let sends = MessagesDummy
      log.write('should return NOT succes', Etask.FINDALL, false, sends)
      jest
        .spyOn(messageService, 'getMessages')
        .mockImplementation(() =>
          Promise.resolve(sends),
        );

      return request(app.getHttpServer())
        .get('/V1/Message')
        .send("DEFAULT_ERROR")
        .expect(201)
        .expect((response) => {
          expect(response.body.status).toEqual(201);
        });

    });
  })

  describe('Method getById', () => {
    it('getById response 200', () => {
      let sends = MessageControllerDummy
      log.write('should return succes', Etask.FINDONE, false, sends)
      jest
        .spyOn(messageService, 'getById')
        .mockImplementation(() =>
          Promise.resolve(sends),
        );

      return request(app.getHttpServer())
        .get('/V1/Message/CHANNEL_ERROR')
        .send("CHANNEL_ERROR")
        .expect(200)
        .expect((response) => {
          expect(response.body.status).toEqual(200);
        });

    });
  })


});

