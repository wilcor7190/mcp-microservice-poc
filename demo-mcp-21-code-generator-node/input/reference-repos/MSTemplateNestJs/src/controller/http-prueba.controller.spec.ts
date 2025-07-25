import { INestApplication } from '@nestjs/common';
import { HttpPruebaController } from "./http-prueba.controller";
import { HttpPruebaService } from "./service/impl/http-provider.service.impl";
import { Test, TestingModule } from '@nestjs/testing';
import { IHttpPruebaService } from '../controller/service/http-prueba.service';
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
import { HttpPruebaDummy} from '../../test/response-dummy';



//Se realiza una proyeccion del servicio del aplicativo
jest.mock('../controller/service/http-prueba.service');

describe('MockupController Class', () => {
    let app: INestApplication;
    let controller: HttpPruebaController
    let service: IHttpPruebaService;
    let log: Logging;
    let loggerMock: any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [HttpPruebaController],
            providers: [
                { provide: IHttpPruebaService, useClass: HttpPruebaService },
                Logging
            ],
            imports: [AppModule, CommonModule, DataProviderModule, CoreModule, ControllerModule,]
        }).compile();
        loggerMock = {
            log: jest.fn()
        };
        log = new Logging(loggerMock);

        controller = module.get<HttpPruebaController>(HttpPruebaController);
        service = module.get<IHttpPruebaService>(IHttpPruebaService);
        app = module.createNestApplication();
        log = module.get<Logging>(Logging);
        await app.init();
    })

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('Method getById', () => {
        it('getById response 200', () => {
            let sends = HttpPruebaDummy
            log.write('should return succes', Etask.FINDONE, false, sends)
            jest
                .spyOn(service, 'getById')

            return request(app.getHttpServer())
                .get('/V1/HttpProvider/1')
                .send(sends)
                .expect(200)
                .expect((response) => {
                    expect(response.body.status).toEqual(200);
                });

        });
    })

});
