/*
https://docs.nestjs.com/fundamentals/testing#unit-testing
*/
import { Test } from '@nestjs/testing';
import { ArgumentsHost, BadRequestException, HttpException } from '@nestjs/common';
import { ExceptionManager } from './exceptions-manager.filter';
import { IServiceTracingUc } from 'src/core/use-case/resource/service-tracing.resource.uc';
import { IServiceErrorUc } from 'src/core/use-case/resource/service-error.resource.uc';
import { BusinessException } from './business-exceptions';
import { LegacyException } from './legacy-exeptions';

describe('ExceptionsManagerFilter', () => {
  const mockServiceTracingUcimpl = {createServiceTracing: jest.fn()}
  const mockServiceErrorUcimpl = {createServiceError: jest.fn()}
  let argsHost: ArgumentsHost = {
    getArgs: jest.fn(),
    getArgByIndex: jest.fn(),
    switchToRpc: jest.fn(),
    switchToHttp: () => ({
      getResponse: jest.fn().mockReturnValue({json: jest.fn(), status: jest.fn().mockReturnValue({ json: jest.fn() })}),
      getRequest: jest.fn().mockReturnValue({'url':"", body: {}, headers: {'content-type': 'application/json', 'headers':{channel:''}}}),
      getNext: jest.fn()
    }),
    switchToWs: jest.fn(),
    getType: jest.fn()
  };
  let exceptionManagerFilter: Partial<ExceptionManager>;
  beforeEach( async () => {
    const module = await Test.createTestingModule({
      providers: [ExceptionManager, { provide: IServiceTracingUc, useValue: mockServiceTracingUcimpl }, { provide: IServiceErrorUc, useValue: mockServiceErrorUcimpl }],
      exports: [IServiceTracingUc, IServiceErrorUc],
    }).compile();

    exceptionManagerFilter = module.get<ExceptionManager>(ExceptionManager);
  });

  describe('catch', () => {
    it('should validate Business Exception', async () => {
      const exception = new BusinessException(201, "", false);
      const result = await exceptionManagerFilter.catch(exception, argsHost)
      expect(result).toBeUndefined();
    });
    it('should validate Http Exception', async () => {
      const exception = new HttpException({}, 500);
      const result = await exceptionManagerFilter.catch(exception, argsHost)
      expect(result).toBeUndefined();
    });
    it('should validate Bad Reque Exception', async () => {
      const exception = new BadRequestException({});
      const result = await exceptionManagerFilter.catch(exception, argsHost)
      expect(result).toBeUndefined();
    });
    it('should validate Legacy Exception', async () => {
      const exception = new LegacyException(500, "", false, {document: {}});
      const result = await exceptionManagerFilter.catch(exception, argsHost)
      expect(result).toBeUndefined();
    });
  })
});
