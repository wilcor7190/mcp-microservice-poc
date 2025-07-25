import { GlobalValidateIService } from './globalValidate.service.impl';
import { IServiceErrorUc } from 'src/core/use-case/resource/service-error.resource.uc';
import { IServiceTracingUc } from 'src/core/use-case/resource/service-tracing.resource.uc';
import GeneralUtil from 'src/common/utils/generalUtil';
import Logging from 'src/common/lib/logging';

describe('GlobalValidateIService', () => {
  let globalValidateService: GlobalValidateIService;
  let serviceError: jest.Mocked<IServiceErrorUc>;
  let serviceTracing: jest.Mocked<IServiceTracingUc>;
  
  jest.mock('src/common/lib/logging', () => {
    return {
      Logging: jest.fn().mockImplementation(() => {
        return {
          write: jest.fn(),
          // No necesitas mockear LOG_LEVEL y context si son privados
        };
      }),
    };
  });
  let logger = new Logging('prueba');

  beforeEach(async() => {
    serviceError = {
    } as jest.Mocked<IServiceErrorUc>;

    serviceTracing = {
      createServiceTracing: jest.fn(),
    } as jest.Mocked<IServiceTracingUc>;

    logger = new Logging('prueba2');

    globalValidateService = new GlobalValidateIService(serviceError, serviceTracing);
  });

  describe('validateChannel', () => {
    it('should return true if the channel is valid', async () => {
      // Arrange
      const channel = 'valid-channel';
      jest.spyOn(GeneralUtil, 'validateChannel').mockReturnValue(true);

      // Act
      const result = await globalValidateService.validateChannel(channel);
      expect(result).toBe(true);
    });

    it('should throw a BusinessException if the channel is invalid', async () => {
      // Arrange
      const channel = 'invalid-channel';
      jest.spyOn(GeneralUtil, 'validateChannel').mockReturnValue(false);
      // Act
      try{
        const result = await globalValidateService.validateChannel(channel);
      }
      catch(error){
        const error2={
          code: 400,
          description: "CHANNEL_ERROR",
          details: undefined,
          reason: undefined,
          success: true,
          task_description: "Validation of the channel",
          task_name: "VALIDATE_CHANNEL",
        }
        expect(error).toEqual(error2)
      }
     

    });

    it('should re-throw any error thrown during validation', async () => {
      // Arrange
      const channel = 'valid-channel';
      const error = new Error('Some error');
      jest.spyOn(GeneralUtil, 'validateChannel').mockImplementation(() => {
        throw error;
      });

      // Act
      const result = globalValidateService.validateChannel(channel);

      // Assert
       expect(result).rejects.toThrowError(error);
      expect(serviceTracing.createServiceTracing).not.toHaveBeenCalled();
    });
  });
});