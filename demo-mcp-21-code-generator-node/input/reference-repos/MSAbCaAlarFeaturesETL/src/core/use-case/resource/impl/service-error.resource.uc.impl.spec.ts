import { IServiceError } from '@claro/generic-models-library';
import { IServiceErrorProvider } from 'src/data-provider/service-error.provider';
import { ServiceErrorUcimpl } from './service-error.resource.uc.impl';
import { Etask, ETaskDesc } from 'src/common/utils/enums/taks.enum';
import { ITaskError } from 'src/core/entity/service-error/task-error.entity';
import { BusinessException } from '../../../../common/lib/business-exceptions';

describe('ServiceErrorUcimpl', () => {
  let serviceErrorUc: ServiceErrorUcimpl;
  let serviceErrorProviderMock: jest.Mocked<IServiceErrorProvider>;

  beforeEach(() => {
    serviceErrorProviderMock = {
      createServiceError: jest.fn(),
    } as any;

    serviceErrorUc = new ServiceErrorUcimpl(serviceErrorProviderMock);
  });

  describe('createServiceError', () => {
    it('should call createServiceError on serviceErrorProvider', async () => {
      let task: ITaskError = {
        name: '' as Etask,
        description: '' as ETaskDesc,
      };

      const dataError: IServiceError = {
        success: false,
        serviceId: '',
        origin: 'getData()',
        method: 'GET JOB',
        message: "Cannot read property 'values' of null",
        stack:
          "TypeError: Cannot read property 'values' of null",
        request: {
          request: 'Job caracteristicas - precios (Terminales y tecnologia)',
        },
      };

      await serviceErrorUc.createServiceError(dataError, task);

      expect(serviceErrorProviderMock.createServiceError).toHaveBeenCalled;
    });
    it('should call createServiceError with BusinessException instance', async () => {
      let task: ITaskError = {
        name: '' as Etask,
        description: '' as ETaskDesc,
      };
      const dataError = new BusinessException(400, 'getData()');

      try {
        await serviceErrorUc.createServiceError(
          dataError as BusinessException,
          task,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessException);
      }
    });
  });
});
