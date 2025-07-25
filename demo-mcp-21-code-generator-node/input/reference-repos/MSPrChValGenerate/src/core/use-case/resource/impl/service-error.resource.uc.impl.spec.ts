import { IServiceErrorProvider } from 'src/data-provider/service-error.provider';
import { IServiceError , ITaskError} from '@claro/generic-models-library';
import GeneralUtil from 'src/common/utils/GeneralUtil';
import { ServiceErrorUcimpl } from './service-error.resource.uc.impl';
import { Etask, ETaskDesc } from 'src/common/utils/enums/taks.enum';
import { ELevelsErros } from "src/common/utils/enums/logging.enum";

describe('ServiceErrorUcimpl', () => {
  let serviceErrorUc: ServiceErrorUcimpl;
  let serviceErrorProviderMock: jest.Mocked<IServiceErrorProvider>;

  beforeEach(() => {
    serviceErrorProviderMock = {
      createServiceError: jest.fn(),
    };

    serviceErrorUc = new ServiceErrorUcimpl(serviceErrorProviderMock);
  });

  describe('createServiceError', () => {
    it('should call createServiceError on serviceErrorProvider', async () => {
      // Arrange

      let task: ITaskError = {
        taskName: 'Etask.TRANSFORMDATA',
        taskDescription: 'ETaskDesc.TRANSFORMDATA',
      };

      const dataError: IServiceError = {
        success: false,
        serviceId: '',
        origin: 'getData()',
        method: 'GET JOB',
        task: task,
        message: "Cannot read property 'values' of null",
        stack:
          "TypeError: Cannot read property 'values' of null",
        request: {
          request: 'Job caracteristicas - precios (Terminales y tecnologia)',
        },
      };
      // Act
      await serviceErrorUc.createServiceError(dataError,task);

      // Assert
      expect(serviceErrorProviderMock.createServiceError).toHaveBeenCalled()
    });
  });

});
