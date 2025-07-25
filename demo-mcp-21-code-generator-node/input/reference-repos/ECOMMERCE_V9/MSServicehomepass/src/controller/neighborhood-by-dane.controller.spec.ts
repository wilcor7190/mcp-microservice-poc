import { Test } from '@nestjs/testing';
import { NeighborhoodbydaneController } from './neighborhoodbydane.controller';
import { INeighborhoodbydane } from './service/neighborhoodbydane.service';
import { Neighborhoodbydane } from './service/impl/neighborhoodbydane.service.impl';
import {
  NeighborHood_400,
  NeighborHood_200,
  NeighborHood_201,
  QueryExample,
  QueryFakeLegacy,
  QueryFakeDataValidation,
} from 'src/mockup/Neighborhoodbydane/responseNeighbordhoodbydane.mock';
import rTracer = require('cls-rtracer');

jest.setTimeout(15000);
describe('NeighborhoodbydaneController', () => {
  let service: INeighborhoodbydane;
  let mockService: Pick<Neighborhoodbydane, 'consultNeighborhoodbydane'>;
  let controller: NeighborhoodbydaneController;


  beforeEach(async () => {
    mockService = {
      consultNeighborhoodbydane: jest.fn()
    }
    const module = await Test.createTestingModule({
      controllers: [NeighborhoodbydaneController],
      providers: [
        { provide: INeighborhoodbydane, useValue: mockService },
      ],
    }).compile();
    controller = module.get<NeighborhoodbydaneController>(NeighborhoodbydaneController);
    service = module.get<INeighborhoodbydane>(INeighborhoodbydane);
  });


  describe('consultNeighborhoodbydane endpoint', () => {
    it('should return 200', async () => {
      jest.spyOn(service, 'consultNeighborhoodbydane').mockResolvedValueOnce(NeighborHood_200);
      const result = await controller.consultNeighborhoodbydane(`EC9_B2C`,'token', QueryExample);
      expect(result).toBe(NeighborHood_200);
      expect(result.status).toBe(200);
    });

    it('should return 201 legacy error', async () => {
      jest.spyOn(service, 'consultNeighborhoodbydane').mockResolvedValueOnce(NeighborHood_201);
      const result = await controller.consultNeighborhoodbydane(`EC9_B2C`,'token', QueryFakeLegacy);
      expect(result).toBe(NeighborHood_201);
      expect(result.status).toBe(201);
    });

    it('should return 400 data validation', async () => {
      jest.spyOn(service, 'consultNeighborhoodbydane').mockResolvedValueOnce(NeighborHood_400);
      const result = await controller.consultNeighborhoodbydane(`EC9_B2C`,'token', QueryFakeDataValidation);
      expect(result).toBe(NeighborHood_400);
      expect(result.status).toBe(400);
      jest.spyOn(service, 'consultNeighborhoodbydane').mockImplementation(() => Promise.resolve(NeighborHood_400));
    });
  });
});
