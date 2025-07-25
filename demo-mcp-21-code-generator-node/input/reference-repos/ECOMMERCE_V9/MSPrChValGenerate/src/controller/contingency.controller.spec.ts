import { Test, TestingModule } from '@nestjs/testing';

import { ContingencyController } from './contingency.controller';
import { IContingencyService } from './service/contingency.service';
import { BulkManualDTO } from './dto/general/general.dto';
import { IServiceTracingUc } from 'src/core/use-case/resource/service-tracing.resource.uc';
import { HttpStatus } from '@nestjs/common';

//Se realiza una proyeccion del servicio del aplicativo
jest.mock('../controller/service/contingency.service.ts');

describe('Confirm Reserv Controller', () => {
  let controller: ContingencyController;

  let mockContingencyController: jest.Mocked<IContingencyService>;
  let mockServiceTracing: jest.Mocked<IServiceTracingUc>;

  beforeEach(async () => {
    mockContingencyController = {
      getData: jest.fn(),
      getDataMobile: jest.fn(),
      getDataHomes: jest.fn(),
      getDataManual: jest.fn(),
    } as jest.Mocked<IContingencyService>;

    mockServiceTracing = {
      createServiceTracing: jest.fn(),
    } as jest.Mocked<IServiceTracingUc>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContingencyController],
      providers: [
        { provide: IContingencyService, useValue: mockContingencyController },
        { provide: IServiceTracingUc, useValue: mockServiceTracing },
      ],
    }).compile();

    controller = module.get<ContingencyController>(ContingencyController);
  });

  describe('ContingencyController', () => {
    describe('loadManualController', () => {
      it('should call contingencyService.getDataManual and return a ResponseService', async () => {
        mockContingencyController.getDataManual.mockResolvedValue({
          success: true,
          status: HttpStatus.OK,
          message: 'OK',
        });
        const req: BulkManualDTO = {
          category: 'Hogares',
          fileType: 'Caracteristicas',
        };
  
        const result = await controller.loadManualController(req);
  
        expect(mockContingencyController.getDataManual).toHaveBeenCalled();
        expect(result.status).toBe(HttpStatus.OK);
      });
    });
  });
});
