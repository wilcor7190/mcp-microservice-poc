import { Test, TestingModule } from '@nestjs/testing';
import { IServiceErrorProvider } from '../../../../data-provider/service-error.provider';
import { Etask, ETaskDesc } from '../../../../common/utils/enums/task.enum';
import { ServiceErrorUcimpl } from './service-error.resource.uc.impl';
import { ELevelsErrors } from '../../../../common/utils/enums/logging.enum';
import { IServiceTracingInitial, ITaskError } from '@claro/generic-models-library';

describe('ServiceErrorUcimpl', () => {
  let serviceErrorUc: ServiceErrorUcimpl;
  let mockServiceErrorProvider: IServiceErrorProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceErrorUcimpl, { provide: IServiceErrorProvider, useValue: { createServiceError: jest.fn() } }],
    }).compile();

    serviceErrorUc = module.get<ServiceErrorUcimpl>(ServiceErrorUcimpl);
    mockServiceErrorProvider = module.get<IServiceErrorProvider>(IServiceErrorProvider);
  });

  describe('createServiceError', () => {
    it('should create a service error', async () => {
      const error = { success: false, message: 'Test error' };
      const taskValue = 'GET_INFO_BY_ID';
      const task_description = 'Error validate-data.service.impl getInfoById';
      const task: ITaskError = { taskName: taskValue as unknown as Etask, taskDescription: task_description as unknown as ETaskDesc };
      const request = { data: 'Test request' };
      const tracingInfoPrincipal: IServiceTracingInitial = {
        id: '123',
        origin: 'Test',
        method: 'GET',
        channel: 'Test',
      };
      const nivel = ELevelsErrors.ERROR;

      await serviceErrorUc.createServiceError(error, task, request, tracingInfoPrincipal, nivel);

      expect(mockServiceErrorProvider.createServiceError).toHaveBeenCalledWith({
        success: false,
        serviceId: '123',
        origin: 'Test',
        method: 'GET',
        task: { taskDescription: 'Error validate-data.service.impl getInfoById', taskName: 'GET_INFO_BY_ID' },
        message: 'Test error',
        channel: 'Test',
        stack: undefined,
        request: { data: 'Test request' },
        response: undefined,
      });
    });
  });
});
