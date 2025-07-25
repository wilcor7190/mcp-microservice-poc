import { INestApplication } from '@nestjs/common';
import { MockupController } from "./mockup.controller";
import { MockupService } from "./service/impl/mockup.service.impl";
import { Test, TestingModule } from '@nestjs/testing';
import { IMockupService } from '../controller/service/mockup.service';
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
import { MockupDummy,MockupGetDummy } from '../../test/response-dummy';
import { MockupDummyRq, MockupDummyRqError } from '../../test/request-dummy';

//Se realiza una proyeccion del servicio del aplicativo
jest.mock('../controller/service/mockup.service.ts');

describe('MockupController Class', () => {
    let app: INestApplication;
    let mockupController: MockupController
    let mockupeService: IMockupService;
    let log: Logging;
    let loggerMock: any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MockupController],
            providers: [
                { provide: IMockupService, useClass: MockupService },
                { provide: IGlobalValidateIService, useClass: GlobalValidateIService },
                Logging
            ],
            imports: [AppModule, CommonModule, DataProviderModule, CoreModule, ControllerModule,]
        }).compile();
        loggerMock = {
            log: jest.fn()
        };
        log = new Logging(loggerMock);

        mockupController = module.get<MockupController>(MockupController);
        mockupeService = module.get<IMockupService>(IMockupService);
        app = module.createNestApplication();
        log = module.get<Logging>(Logging);
        await app.init();
    })

    it('should be defined', () => {
        expect(MockupController).toBeDefined();
    });

    describe('Method Create', () => {
        it('CreateMockup response 200', () => {
            let sends = MockupDummyRq
            log.write('should return succes', Etask.CREATE, false, sends)
            jest.spyOn(mockupeService, 'create')

            return request(app.getHttpServer())
                .post('/V1/Mockup/')
                .send(sends)
                .expect(201)
                .expect((response) => {
                    expect(response.body.status).toEqual(200);
                });

        });

    })

    describe('Method FindOne', () => {
        it('FindOne response 200', () => {
            let sends = MockupGetDummy
            log.write('should return succes', Etask.FINDONE, false, sends)
            jest
                .spyOn(mockupeService, 'findOne')

            return request(app.getHttpServer())
                .get('/V1/Mockup/1')
                .send(sends)
                .expect(200)
                .expect((response) => {
                    expect(response.body.status).toEqual(200);
                });

        });
    })

    describe('Method FindAll', () => {
        it('findAll response 201', () => {
            let sends = MockupGetDummy
            log.write('should return succes', Etask.FINDALL, false, sends)
            jest.spyOn(mockupeService, 'findAll')
            return request(app.getHttpServer())
                .get('/V1/Mockup/')
                .send(sends)
                .expect(201)
                .expect((response) => {
                    expect(response.body.status).toEqual(201);
                });

        });
    })

    describe('Method update', () => {
        it('UpdateMockup response 200', () => {
            let sends = MockupDummyRq
            log.write('should return succes', Etask.UPDATE, false, sends)
            jest.spyOn(mockupeService, 'update')

            return request(app.getHttpServer())
                .patch('/V1/Mockup/1')
                .send(sends)
                .expect(200)
                .expect((response) => {
                    expect(response.body.status).toEqual(200);
                });

        });

        it('UpdateMockup response 400', () => {
            let sends = MockupDummyRqError
            log.write('should return NOT succes', Etask.UPDATE, false, sends)
            jest.spyOn(mockupeService, 'update')

            return request(app.getHttpServer())
                .patch('/V1/Mockup/1')
                .send(sends)
                .expect(400)
                .expect((response) => {
                    expect(response.body.status).toEqual(400);
                });

        });
    })

    describe('Method remove', () => {
        it('RemoveMockup response 200', () => {
            let sends = MockupDummy
            log.write('should return succes', Etask.REMOVE, false, sends)
            jest.spyOn(mockupeService, 'remove')

            return request(app.getHttpServer())
                .del('/V1/Mockup/1')
                .send(sends)
                .expect(200)
                .expect((response) => {
                    expect(response.body.status).toEqual(200);
                });

        });
    })





});