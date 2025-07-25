import { ParamUcimpl } from '../../core/use-case/resource/impl/param.resource.uc.impl';
import { EtypeDocument } from './enums/params.enum';
import generalConfig from '../configuration/general.config';
import GeneralUtil from "./GeneralUtil";
import { IMessage } from '@claro/generic-models-library';
import { ELevelsErros } from './enums/logging.enum';
import { HttpStatus } from '@nestjs/common';
import Logging from '../lib/logging';
import {  Etask,ETaskDesc } from './enums/taks.enum';

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
    expect(result).toBe(false);
  });

  it('transformTypeDoc CC & CE', async () => {
    const resultcc = await GeneralUtil.transformTypeDoc(EtypeDocument.CC);
    const resultce = await GeneralUtil.transformTypeDoc(EtypeDocument.CE);
    expect(resultcc).toBe(1);
    expect(resultce).toBe(4);
  });

  it('validateValueRequired numero', async () => {
    const result = await GeneralUtil.validateValueRequired(12);
    expect(result).toBe(true);
  });

  it('validateValueRequired cadena', async () => {
    const result = await GeneralUtil.validateValueRequired("cadena");
    expect(result).toBe(true);
  });
 
  it('validateValueRequired undefined', async () => {
    const result = await GeneralUtil.validateValueRequired(undefined);
    expect(result).toBe(false);
  });

  it('getOrigin', async () => {
    const result = await GeneralUtil.getOrigin('http://');
    expect(result).toContain(generalConfig.apiMapping);
  });

  it('validateDate dates are equal', async () => {
    let date1 = new Date('2023-05-30') 
    let date2 = new Date('2023-05-30') 
    const result = await GeneralUtil.validateDate(date1,date2)
    expect(result).toBe(0)
  });

  it('validateDate first is greater than second', async () => {
    let date1 = new Date('2023-05-30') 
    let date2 = new Date('2023-05-20') 
    const result = await GeneralUtil.validateDate(date1,date2)
    expect(result).toBe(1)
  });

  it('validateDate first is less than second', async () => {
    let date1 = new Date('2023-05-20') 
    let date2 = new Date('2023-05-30') 
    const result = await GeneralUtil.validateDate(date1,date2)
    expect(result).toBe(-1)
  });

});

it('convertXmlToJson should return JSON object', async () => {
  const xml = '<root><name>John</name><age>30</age></root>';
  const expectedJson = { root: { name: 'John', age: '30' } };
  const result = await GeneralUtil.convertXmlToJson(xml);
  expect(result).toEqual(expectedJson);
});

it('convertXmlToJson should throw error for invalid XML', async () => {
  const xml = '<root><name>John</name><age>30</age>';
  await expect(GeneralUtil.convertXmlToJson(xml)).rejects.toThrow();
});

it('convertXmlToJson should return null for empty input', async () => {
  const xml = '';
  const result = await GeneralUtil.convertXmlToJson(xml);
  expect(result).toBeNull();
});

it('should return the difference with a different data', () => {
  const date1 = new Date('xxxxxxx');
  const date2 = new Date('2022-01-03');
  const result = GeneralUtil.validateDate(date1, date2);
  expect(result).toBe(NaN);
});

describe('test methods general utils', () => {

  it("should return false if the validated channel is not true", () => {
    const channel = "EC9_B2B";
    const result = GeneralUtil.validateChannel(channel);
    expect(result).toBe(false);
  });

  it('should return null if the input is an empty object', async () => {
    const obj = {};
    const result = GeneralUtil.isEmptyObject(obj);
    expect(result).toBe(false);
  });

  it('convertXmlToJson should return JSON object233', async () => {
    const xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/"><soapenv:Header/><soapenv:Body><tem:Add><tem:intA>?</tem:intA><tem:intB>?</tem:intB></tem:Add></soapenv:Body></soapenv:Envelope>';
    const expectedJson =  {"soapenv:Envelope": {"$": {},"soapenv:Header": "","soapenv:Body": {"tem:Add": {"tem:intA": "?","tem:intB": "?"}}}};
    const result = await GeneralUtil.convertXmlToJson(xml);
    expect(result).toEqual(expectedJson);
  });
  
  it('should return JSON object if the input is a valid XML string', async () => {
    const xml = '<root><name>John</name><age>30</age></root>';
    const result = await GeneralUtil.convertXmlToJson(xml);
    expect(result).toEqual({ root: { name: 'John', age: '30' } });
  });

  it('should replace specified values in a JSON object', async () => {
    const json = { name: 'John', age: 30, address: '123 Main St' };
    const replaceValues = ['John', 'Main'];
    const replaceBy = '***';
    const result = GeneralUtil.cleanProperties(json, replaceValues, replaceBy);
    expect(result).toEqual({ name: '***', age: 30, address: '123 *** St' });
  });

  it('should return the correct number for a given type of document', async () => {
    const resultCC = GeneralUtil.transformTypeDoc(EtypeDocument.CC);
    const resultCE = GeneralUtil.transformTypeDoc(EtypeDocument.CE);
    const resultInvalid = GeneralUtil.transformTypeDoc('invalid' as EtypeDocument);
    expect(resultCC).toBe(1);
    expect(resultCE).toBe(4);
    expect(resultInvalid).toBe(null);
  });

  it('should return true if the input is a non-empty string or number', async () => {
    const value1 = 'John';
    const value2 = 30;
    const result1 = GeneralUtil.validateValueRequired(value1);
    const result2 = GeneralUtil.validateValueRequired(value2);
    expect(result1).toBe(true);
    expect(result2).toBe(true);
  });

  it('should return false if the input is undefined or null', async () => {
    const value1 = undefined;
    const value2 = null;
    const result1 = GeneralUtil.validateValueRequired(value1);
    const result2 = GeneralUtil.validateValueRequired(value2);
    expect(result1).toBe(false);
    expect(result2).toBe(false);
  });

  it('should return the origin URL of a given URL', async () => {
    const url = 'http://localhost:3000/api/v1/users';
    const result = GeneralUtil.getOrigin(url);
    expect(result).toBe('/MSPrChValGeneratehttp://localhost:3000/api/v1/users');
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


  it('should not update a message in cache if message is not found', async () => {

    const messages: IMessage[]  = [];
    const updatedMessage: IMessage = { id: '3', description: 'updated description', message: 'updated message' };
    await GeneralUtil.cacheMessages(cachee, 'update', undefined, updatedMessage);
    expect(cachee.get).toHaveBeenCalledWith('messages');
    expect(cachee.set.mockReset()).not.toHaveBeenCalled();
  });

  it('should validate the difference in days between two dates', async () => {
    const date1 = new Date('2022-01-01');
    const date2 = new Date('2022-01-02');
    const result = GeneralUtil.validateDate(date1, date2);
    expect(result).toBe(-1);
  });



    it('should return null for an empty string', async () => {
      const xml = '';
      const result = await GeneralUtil.convertXmlToJson(xml);
      expect(result).toBeNull();
    });

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

describe('validateData', () => {

  it('validateData null', () => {
    const param = null;
    const result = GeneralUtil.validateData(param);
    expect(result).toBe(0);
  });

  it('validateData undefined ', () => {
    const param = undefined;
    const result = GeneralUtil.validateData(param);
    expect(result).toBe(0);
  });

});
