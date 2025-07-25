import { ParamUcimpl } from '../../core/use-case/resource/impl/param.resource.uc.impl';
import { EtypeDocument } from './enums/params.enum';
import { EmessageMapping } from './enums/message.enum';
import { MappingStatusCode } from '../configuration/mapping-statuscode';
import { BusinessException } from '../lib/business-exceptions';
import GeneralUtil from './generalUtil';
import { ELevelsErros } from './enums/logging.enum';
import { HttpStatus } from '@nestjs/common';
import Logging from '../lib/logging';
import { Etask } from './enums/taks.enum';

describe('test methods general utils', () => {

  it("should return true if the validated channel is true", () => {
    const channel = "EC9_B2C";
    ParamUcimpl.params = [{
      id_param: "CHANNEL",
      description: "canales correspondientes al servicio",
      status: true,
      createdUser: "",
      updatedUser: "",
      createdAt: "",
      updatedAt: "",
      values: ["EC9_B2C"]
    }];
    const result = GeneralUtil.validateChannel(channel);
    expect(result).toBe(true);
  });

  it('transformTypeDoc CC & CE', async () => {
    const resultcc = await GeneralUtil.transformTypeDoc(EtypeDocument.CC);
    const resultce = await GeneralUtil.transformTypeDoc(EtypeDocument.CE);
    expect(resultcc).toBe(1);
    expect(resultce).toBe(4);
  });

  it('getDateUTC', async () => {
    const result = await GeneralUtil.getDateUTC()
    expect(result).toBeDefined
  });

  it('validateBoolean is true', async () => {
    let value = true
    const result = await GeneralUtil.validateBoolean(value)
    expect(result).toBe(true)
  });

  it('validateBoolean is false', async () => {
    let value = false
    const result = await GeneralUtil.validateBoolean(value)
    expect(result).toBe(false)
  });

  it('validateValueAndString', async () => {
    let element1 = 'cadena'
    let element2 = 'cadena'
    const result = await GeneralUtil.validateValueAndString(element1,element2)
    expect(result).toBe(true)
  });

  it('validateValueAndString', async () => {
    let element1 = 'cadena'
    let element2 = 'string'
    const result = await GeneralUtil.validateValueAndString(element1,element2)
    expect(result).toBe(false)
  });

  it('ifExist is exist', async () => {
    let element1 = 'cadena'
    const result = await GeneralUtil.ifExist(element1)
    expect(result).toBeDefined()
  });

  it('ifExist is not exist', async () => {
    let element1 = ''
    const result = await GeneralUtil.ifExist(element1)
    expect(result).toBe('')
  });

});




describe('test methods general utils', () => {

  it("should return false if the validated channel is not true", () => {
    const channel = "EC9_B2B";
    const result = GeneralUtil.validateChannel(channel);
    expect(result).toBe(false);
  });

  it('should return the correct number for a given type of document', async () => {
    const resultCC = GeneralUtil.transformTypeDoc(EtypeDocument.CC);
    const resultCE = GeneralUtil.transformTypeDoc(EtypeDocument.CE);
    const resultInvalid = GeneralUtil.transformTypeDoc('invalid' as EtypeDocument);
    expect(resultCC).toBe(1);
    expect(resultCE).toBe(4);
    expect(resultInvalid).toBe(null);
  });

  
  
  
  let cachee;

  beforeEach(() => {
    cachee = {
      set: jest.fn().mockReset(),
      get: jest.fn().mockResolvedValue([]),
      del: jest.fn(),
      reset: jest.fn(),
      wrap: jest.fn(),
      store:{
        get: jest.fn(),
        set: jest.fn(),
        del: jest.fn(),
        reset: jest.fn(),
        mset: jest.fn(),
        mget: jest.fn(),
        mdel: jest.fn(),
        keys: jest.fn(),
        ttl: jest.fn(),
      },
    };
  });



});


it('should throw a BusinessException with the given parameters', () => {
  const document = { order1: { id: 1, name: 'Order 1' }, order2: { id: 2, name: 'Order 2' } };
  const message = EmessageMapping.DEFAULT_ERROR;
  const status = MappingStatusCode.NOT_FOUND;
  const success = false;
  expect(() => GeneralUtil.generateBusinessException(document, message, status, success)).toThrow(BusinessException);
});


describe('getTemplateXML', () => {

  it('should throw an error if the specified XML file does not exist', () => {
    expect(() => {
      GeneralUtil.getTemplateXML('nonexistent');
    }).toThrow();
  });
});

describe('getLevelError', () => {
  it('should return ERROR level if result is not executed', () => {
    const result = { executed: false };
    const level = GeneralUtil.getLevelError(result);
    expect(level).toBe(ELevelsErros.ERROR);
  });

  it('should return INFO level if result status is OK', () => {
    const result = { executed: true, status: HttpStatus.OK };
    const level = GeneralUtil.getLevelError(result);
    expect(level).toBe(ELevelsErros.INFO);
  });

  it('should return INFO level if result status is CREATED', () => {
    const result = { executed: true, status: HttpStatus.CREATED };
    const level = GeneralUtil.getLevelError(result);
    expect(level).toBe(ELevelsErros.INFO);
  });

  it('should return WARNING level if result status is not OK or CREATED', () => {
    const result = { executed: true, status: HttpStatus.BAD_REQUEST };
    const level = GeneralUtil.getLevelError(result);
    expect(level).toBe(ELevelsErros.WARNING);
  });
});describe('logRequestResponse', () => {
  it('should log request with INFO level and "Entrada Principal" message', () => {
    const req = { url: '/api/users', method: 'GET' };
    const request = { headers: { 'Content-Type': 'application/json' }, body: {} };
    const name = 'TestLogger';
    const spyWrite = jest.spyOn(Logging.prototype, 'write');
    GeneralUtil.logRequestResponse(req, request, name);
    expect(spyWrite).toHaveBeenCalledWith(
      'Entrada Principal - /api/users - GET',
      Etask.REQUEST_HTTP,
      ELevelsErros.INFO,
      request,
      undefined,
      undefined
    );
  });



  it('should log response with WARNING level and "Salida Principal" message when status is not 200', () => {
    const req = { url: '/api/users', method: 'GET' };
    const request = { headers: { 'Content-Type': 'application/json' }, body: {} };
    const name = 'TestLogger';
    const data = { status: 404, body: { message: 'Not found' } };
    const spyWrite = jest.spyOn(Logging.prototype, 'write');
    GeneralUtil.logRequestResponse(req, request, name, data);
    expect(spyWrite).toHaveBeenCalledWith(
      'Salida Principal - /api/users - GET',
      Etask.REQUEST_HTTP,
      ELevelsErros.WARNING,
      request,
      data,
      undefined
    );
  });


});

describe('traceabilityInterceptor', () => {

  it('should set the status to STATUS_FAILED when the response status is not 200', () => {
    const req = { url: '/test', method: 'SET' };
    const request = 'test request';
    const data = { status: 400, message: 'test response' };
    const executionTime = 100;
    const result = GeneralUtil.traceabilityInterceptor(req, request, data, executionTime);
    expect(result.setStatus).toBeDefined();
  });
});
