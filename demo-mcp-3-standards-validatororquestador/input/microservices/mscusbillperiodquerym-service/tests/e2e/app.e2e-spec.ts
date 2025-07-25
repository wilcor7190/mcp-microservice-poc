import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('E2E Tests', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  
  it('GET /MS/CUS/CustomerBill/MSCusBillPeriodQueryM/v1.0/QueryCicleChangeStatusCusBil', () => {
    return request(app.getHttpServer())
      .get('/MS/CUS/CustomerBill/MSCusBillPeriodQueryM/v1.0/QueryCicleChangeStatusCusBil')
      
      .expect(200);
  });
});