import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { DataloadService } from './dataload.service.impl';
import { IServiceErrorUc } from '../../../core/use-case/resource/service-error.resource.uc';
import { IServiceTracingUc } from '../../../core/use-case/resource/service-tracing.resource.uc';
import { IOrchDataloadUC } from '../../../core/use-case/orch-dataload.uc';

describe('DataloadService', () => {
  let service: DataloadService;
  let mockOrchDataloadUC: jest.Mocked<IOrchDataloadUC>;
  let mockServiceErrorUc: jest.Mocked<IServiceErrorUc>;
  let mockServiceTracingUc: jest.Mocked<IServiceTracingUc>;

  beforeEach(async () => {
    mockOrchDataloadUC = {
      orchDataload: jest.fn(),
    } as jest.Mocked<IOrchDataloadUC>;
    mockServiceErrorUc = {
      createServiceError: jest.fn(),
    } as jest.Mocked<IServiceErrorUc>;
    mockServiceTracingUc = {
      createServiceTracing: jest.fn(),
    } as jest.Mocked<IServiceTracingUc>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataloadService,
        { provide: IOrchDataloadUC, useValue: mockOrchDataloadUC },
        { provide: IServiceErrorUc, useValue: mockServiceErrorUc },
        { provide: IServiceTracingUc, useValue: mockServiceTracingUc },
      ],
    }).compile();

    service = module.get<DataloadService>(DataloadService);
  });

  describe('generateDataloadManual', () => {
    it('should not success req not allowed', async () => {
      const req = {
        dataload: '',
      };

      await service.generateDataloadManual(req);

      expect(mockOrchDataloadUC.orchDataload).not.toHaveBeenCalled;
    });
    it('should success', async () => {
      const req = {
        dataload: 'Product-Data',
      };

      const response = await service.generateDataloadManual(req);

      expect(response.status).toBe(HttpStatus.OK);
    });
  });
});
