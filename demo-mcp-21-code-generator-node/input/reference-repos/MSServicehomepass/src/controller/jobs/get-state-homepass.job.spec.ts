import { IJobService } from '../service/get-state-homepass.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './get-state-homepass.job';
import { ResponseService } from '../dto/response-service.dto';
import { IServiceErrorUc } from '../../core/use-case/resource/service-error.resource.uc';
import { IServiceTracingUc } from '../../core/use-case/resource/service-tracing.resource.uc';
import { DetailAddress_200 } from '../../mockup/DetailAddress/detail-address.mock';

describe("getStateHomePass.job", () => {
  let service: IJobService;
  let controller: TasksService;
  let mockService: IJobService;
  let mockServiceErrorUc: IServiceErrorUc;
  let mockServiceTracingUc: IServiceTracingUc;
  beforeEach(async() => {
    mockService = {
      execJob: jest.fn()
    }
    mockServiceErrorUc = {
      createServiceError: jest.fn()
    }

    mockServiceTracingUc = {
      createServiceTracing: jest.fn()
    }
    const module: TestingModule = await Test.createTestingModule({
      controllers:[TasksService],
      providers:[
        {provide: IJobService, useValue:mockService},
        { provide: IServiceErrorUc, useValue: mockServiceErrorUc },
        { provide: IServiceTracingUc, useValue: mockServiceTracingUc }
      ]
    }).compile();
    controller = module.get<TasksService>(TasksService);
    service = module.get<IJobService>(IJobService);
  });

  describe("getStateHomePass.job", () => {
    it("should return 200", async () => {
      const result = await controller.handleCron();
      expect(result).toBeUndefined();
    })
  })
})