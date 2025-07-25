import { HttpStatus } from '@nestjs/common';
import { responseDummy, technologyFeatures } from '../../../test/response-dummy';
import { ParamUcimpl } from '../../core/use-case/resource/impl/param.resource.uc.impl';
import generalConfig from '../configuration/general.config';
import { ELevelsErros } from './enums/logging.enum';
import { EtypeDocument } from './enums/params.enum';
import GeneralUtil from './GeneralUtil';

describe('GeneralUtil prueba diferentes metodos', () => {
  it('debe devolver verdadero si el canal validado es true', () => {
    const channel = 'EC9_B2C';
    ParamUcimpl.params = [
      {
        id_param: 'CHANNEL',
        description: 'canales correspondientes al servicio',
        status: true,
        createdUser: '',
        updatedUser: '',
        createdAt: '',
        updatedAt: '',
        values: ['EC9_B2C'],
      },
    ];
    const result = GeneralUtil.validateChannel(channel);
    expect(result).toBe(true);
  });
});
describe('GeneralUtil prueba diferentes metodos', () => {
  it('should return null if the input is an empty object', async () => {
    const obj = {};
    const result = GeneralUtil.isEmptyObject(obj);
    expect(result).toBe(false);
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
  });

  it('validateDate', () => {
    const result = GeneralUtil.validateDate(new Date(), new Date());
    expect(result).toBe(0);
  });

  it('validateDate', () => {
    const result = GeneralUtil.validateDate(
      new Date('1995-12-17T03:24:00'),
      new Date('1990-12-17T03:24:00'),
    );
    expect(result).toBe(1);
  });

  it('validateDate', () => {
    const result = GeneralUtil.validateDate(
      new Date('1990-12-17T03:24:00'),
      new Date('1995-12-17T03:24:00'),
    );
    expect(result).toBe(-1);
  });

  it('debe devolver verdadero si el canal validado es false', () => {
    const channel = 'chanel1';
    ParamUcimpl.params = [
      {
        id_param: 'CHANNEL',
        description: 'canales correspondientes al servicio',
        status: true,
        createdUser: '',
        updatedUser: '',
        createdAt: '',
        updatedAt: '',
        values: ['EC9_B2C'],
      },
    ];
    const result = GeneralUtil.validateChannel(channel);
    expect(result).toBe(false);
  });

  it('getCorrelationalId', async () => {
    const result = GeneralUtil.getCorrelationalId;
    expect(result).toBeDefined();
  });

  it('validateValueRequired numero', async () => {
    const result = GeneralUtil.validateValueRequired(12);
    expect(result).toBe(true);
  });

  it('validateValueRequired numero', async () => {
    const result = GeneralUtil.validateValueRequired(-12);
    expect(result).toBe(false);
  });

  it('validateValueRequired cadena', async () => {
    const result = GeneralUtil.validateValueRequired('cadena');
    expect(result).toBe(true);
  });

  it('validateValueRequired undefined', async () => {
    const result = GeneralUtil.validateValueRequired(undefined);
    expect(result).toBe(false);
  });

  it('getOrigin', async () => {
    const result = GeneralUtil.getOrigin('http://');
    expect(result).toContain(generalConfig.apiMapping);
  });

  it('cleanProperties', async () => {
    const result = GeneralUtil.cleanProperties(responseDummy, ['success'], 's');
    expect(result).toStrictEqual({
      process: 'e5cca750-f9a8-11ed-a899-25a9d5ddf376',
      s: true,
      status: 200,
      message: 'Inicia el proceso de actualización',
      requestTime: '2023-05-23T15:32:12-05:00',
      responseTime: 100,
      method: 'POST',
      origen: '/RSAbsoluteCalendarAlarmFeaturesETL/V1/Categories/manual',
    });
  });

  it('transformTypeDoc CC', () => {
    const result = GeneralUtil.transformTypeDoc(EtypeDocument.CC);
    expect(result).toBe(1);
  });

  it('transformTypeDoc CE', () => {
    const result = GeneralUtil.transformTypeDoc(EtypeDocument.CE);
    expect(result).toBe(4);
  });

  it('should call generateNameForTechnology with valid feature values', () => {
    const expectedValue = "PRT_BS008LA_1T4G_14P con RELOG mas MALETA y PRUEBA"
    const result = GeneralUtil.createNameForTechnology(technologyFeatures);

    expect(result).toBe(expectedValue);
  }); 
});
