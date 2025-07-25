import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { JobController } from './job.controller';
import { IJobService } from './service/get-state-homepass.service';
import { JobService } from './service/impl/get-state-homepass.service.impl';
import { IGlobalValidateService } from './service/resources/globalValidate.service';
import { GlobalValidateService } from './service/resources/impl/globalValidate.service.impl';
import { ControllerModule } from './controller.module';
import { CoreModule } from 'src/core/core.module';
import { DataProviderModule } from 'src/data-provider/data-provider.module';
import { CommonModule } from 'src/common/common.module';
import { AppModule } from 'src/app.module';
import { mockJob200 } from 'src/mockup/job/job.mock'
import rTracer = require('cls-rtracer');
import { IHomePassRetryUc } from '../core/use-case/homepass-retry.uc';

describe('JobController', () => {
  
  let mockService: IJobService;
  let service: IJobService;
  let controller: JobController;

  beforeEach(async () => {
    mockService = {
      execJob: jest.fn()
    };
    const mockvalidateChannel = {
      validateChannel: jest.fn()
    };
    const mockHomePassRetryUc = {
      getStateHomePass: jest.fn()
    }
    const module = await Test.createTestingModule({
      controllers: [JobController],
      providers: [
        { provide: IJobService, useClass: JobService },
        { provide: IGlobalValidateService, useValue: mockvalidateChannel },
        { provide: IHomePassRetryUc, useValue: mockHomePassRetryUc }
      ]
    }).compile();
    controller = module.get<JobController>(JobController);
    service = module.get<IJobService>(IJobService);
  });

  describe('JobController endpoint', () => {
    it('should return 200', async () => {
      jest.spyOn(service, 'execJob').mockResolvedValueOnce(mockJob200);
      const result = await controller.executeJob();
      expect(result).toBe(mockJob200);
      expect(result.status).toBe(200);
    });
  });
});
