import { ExceptionManager } from "./exceptions-manager.filter";
import { ArgumentsHost, Body, HttpException } from "@nestjs/common";
import { Response } from 'express';
import { BusinessException } from "./business-exceptions";
import { IServiceTracingUc } from "src/core/use-case/resource/service-tracing.resource.uc";
import { IServiceErrorUc } from "src/core/use-case/resource/service-error.resource.uc";
import { Test, TestingModule } from '@nestjs/testing';

describe('ExceptionManager', () => {
  let exceptionManager: ExceptionManager;
  let mockServiceTracingUc: jest.Mocked<IServiceTracingUc>;
  let mockServiceErrorUc: jest.Mocked<IServiceErrorUc>;
  let hostMock: jest.Mocked<ArgumentsHost>;
  let responseMock: Partial<Response>;  

  beforeEach( async() => {
    mockServiceTracingUc = {
      createServiceTracing: jest.fn(),
    } as jest.Mocked<IServiceTracingUc>;

    mockServiceErrorUc = {
      createServiceError: jest.fn(),
    } as jest.Mocked<IServiceErrorUc>;

    responseMock = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    hostMock = {
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      switchToRpc: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(responseMock),
        getRequest: jest.fn().mockReturnValue( {url: "/test", body: "", headers: {channel: "channeltest"}}),

      }),
      switchToWs: jest.fn(),
      getType: jest.fn(),
    } as jest.Mocked<ArgumentsHost>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: IServiceTracingUc, useValue: mockServiceTracingUc },
        { provide: IServiceErrorUc, useValue: mockServiceErrorUc },
      ],
    }).compile();

    
    exceptionManager = new ExceptionManager(mockServiceTracingUc, mockServiceErrorUc);
  
  });



  describe('catch', () => {
    it('should handle BusinessException', async () => {
      const exception = new BusinessException(1,'Error message', false);
      const cont = await exceptionManager.catch(exception, hostMock);
      
      expect(mockServiceTracingUc.createServiceTracing).toHaveBeenCalled();

    });

    it('should handle HttpException', async () => {
      const exception = new HttpException('Internal Server Error', 500);
      const cont = await exceptionManager.catch(exception, hostMock);
      
      expect(mockServiceErrorUc.createServiceError).toHaveBeenCalled();

    });

    it('should handle other exceptions', async () => {
      const exception = new Error('Unknown Error');
      const cont = await exceptionManager.catch(exception, hostMock);
      
      expect(mockServiceErrorUc.createServiceError).toHaveBeenCalled();

    });



  });
});


