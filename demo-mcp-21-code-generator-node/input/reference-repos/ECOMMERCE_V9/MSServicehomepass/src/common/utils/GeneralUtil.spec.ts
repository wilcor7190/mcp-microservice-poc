import { ParamUcimpl } from '../../core/use-case/resource/impl/param.resource.uc.impl';
import generalConfig from '../configuration/general.config';
import { EmessageMapping } from './enums/message.enum';
import { Etask } from './enums/task.enum';
import GeneralUtilities from './generalUtil';

describe('GeneralUtilities prueba diferentes metodos', () => {
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
    const result = GeneralUtilities.validateChannel(channel);
    expect(result).toBe(true);
  });
});
describe('GeneralUtilities prueba diferentes metodos', () => {
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
    const result = GeneralUtilities.validateChannel(channel);
    expect(result).toBe(false);
  });

  it('getCorrelationalId', async () => {
    const result = await GeneralUtilities.getCorrelationalId;
    expect(result).toBeDefined();
  });

  it('validateValueRequired numero', async () => {
    const result = await GeneralUtilities.validateValueRequired(12);
    expect(result).toBe(true);
  });

  it('validateValueRequired cadena', async () => {
    const result = await GeneralUtilities.validateValueRequired('cadena');
    expect(result).toBe(true);
  });

  it('validateValueRequired undefined', async () => {
    const result = await GeneralUtilities.validateValueRequired(undefined);
    expect(result).toBe(false);
  });

  it('getOrigin', async () => {
    const result = GeneralUtilities.getOrigin('http://');
    expect(result).toContain(generalConfig.apiMapping);
  });
});

describe('validateDate', () => {
  it('should return 0 if the dates are equal', () => {
    const date1 = new Date('2021-01-01');
    const date2 = new Date('2021-01-01');

    const result = GeneralUtilities.validateDate(date1, date2);

    expect(result).toBe(0);
  });

  it('should return 1 if the first date is greater than the second date', () => {
    const date1 = new Date('2022-01-01');
    const date2 = new Date('2021-01-01');

    const result = GeneralUtilities.validateDate(date1, date2);

    expect(result).toBe(1);
  });

  it('should return -1 if the first date is less than the second date', () => {
    const date1 = new Date('2021-01-01');
    const date2 = new Date('2022-01-01');

    const result = GeneralUtilities.validateDate(date1, date2);

    expect(result).toBe(-1);
  });
});

describe('convertXmlToJson', () => {
  it('should be ok for valid XML input', async () => {
    const validXml = '<root><name>John</name><age>25</age></root>';
    const expectedJson = {
      root: {
        name: 'John',
        age: '25',
      },
    };
    const result = await GeneralUtilities.convertXmlToJson(validXml);
    expect(result).toStrictEqual(expectedJson);
  });

  it('should return null for empty XML input', async () => {
    const emptyXml = '';
    const expectedJson = null;

    const result = await GeneralUtilities.convertXmlToJson(emptyXml);
    expect(result).toStrictEqual(expectedJson);
  });

  it('should return error for invalid XML input', async () => {
    const invalidXml = '<root><name>John</name><age>25</root>';

    try {
      await GeneralUtilities.convertXmlToJson(invalidXml);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});

describe('traceabilityForCronJob', () => {
  it('should return traceability for start job', () => {
    const response = GeneralUtilities.traceabilityForCronJob(Etask.VALIDATE_CHANNEL);
    expect(response.task).toEqual(expect.stringContaining('START_JOB'));
  });

  it('should return traceability for end job', () => {
    const response = GeneralUtilities.traceabilityForCronJob(Etask.VALIDATE_CHANNEL, 132);
    expect(response.task).toEqual(expect.stringContaining('END_JOB_'));
  });
});

describe('assignDetailMessageErrorByCode', () => {
  it('should return ERROR_TIMEOUT_INESTABILIDAD_SP', () => {
    const response = GeneralUtilities.assignDetailMessageErrorByCode(-1);
    expect(response).toEqual(EmessageMapping.ERROR_TIMEOUT_INESTABILIDAD_SP);
  });

  it('should return ERROR_DIREC_NO_ENCONTRADA', () => {
    const response = GeneralUtilities.assignDetailMessageErrorByCode(1);
    expect(response).toEqual(EmessageMapping.ERROR_DIREC_NO_ENCONTRADA);
  });

  it('should return ERROR_DIRECCION_SIN_HHPP', () => {
    const response = GeneralUtilities.assignDetailMessageErrorByCode(2);
    expect(response).toEqual(EmessageMapping.ERROR_DIRECCION_SIN_HHPP);
  });

  it('should return LEGADO_ERROR', () => {
    const response = GeneralUtilities.assignDetailMessageErrorByCode(99);
    expect(response).toEqual(EmessageMapping.DEFAULT_ERROR);
  });
});

describe('assignGlobalMessageErrorByCode', () => {
  it('should return DEFAULT', () => {
    const response = GeneralUtilities.assignGlobalMessageErrorByCode(1);
    expect(response).toEqual(EmessageMapping.DEFAULT);
  });

  it('should return DEFAULT', () => {
    const response = GeneralUtilities.assignGlobalMessageErrorByCode(2);
    expect(response).toEqual(EmessageMapping.DEFAULT);
  });

  it('should return DEFAULT_ERROR', () => {
    const response = GeneralUtilities.assignGlobalMessageErrorByCode(99);
    expect(response).toEqual(EmessageMapping.DEFAULT_ERROR);
  });
});
