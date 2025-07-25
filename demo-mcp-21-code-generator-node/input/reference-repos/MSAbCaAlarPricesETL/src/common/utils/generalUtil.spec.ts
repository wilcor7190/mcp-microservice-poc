import { ParamUcimpl } from '../../core/use-case/resource/impl/param.resource.uc.impl';
import generalConfig from '../configuration/general.config';
import { EtypeDocument } from './enums/params.enum';
import GeneralUtilities from './generalUtil';

describe('GeneralUtilities prueba diferentes metodos', () => {
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

describe('cleanProperties', () => {
  it('should return 1 if the document type is CC', () => {
    const result = GeneralUtilities.transformTypeDoc(EtypeDocument.CC);

    expect(result).toBe(1);
  });

  it('should return 4 if the document type is CE', () => {
    const result = GeneralUtilities.transformTypeDoc(EtypeDocument.CE);

    expect(result).toBe(4);
  });
});

describe('transformTypeDoc', () => {
  it('should replace values', () => {
    const json = {
      name: 'John',
      age: 25,
      address: '123 Main St',
      city: 'Mainville',
    };
    const replaceValues = ['John', 'Main'];
    const replaceBy = 'Jane';
    const expectedJson = {
      name: 'Jane',
      age: 25,
      address: '123 Jane St',
      city: 'Janeville',
    };
    const cleanedJson = GeneralUtilities.cleanProperties(
      json,
      replaceValues,
      replaceBy,
    );

    expect(cleanedJson).toStrictEqual(expectedJson);
  });

  it('should do nothing for empty json', () => {
    const json = {};
    const replaceValues = ['value'];
    const replaceBy = 'newValue';
    const expectedJson = {};

    const cleanedJson = GeneralUtilities.cleanProperties(
      json,
      replaceValues,
      replaceBy,
    );

    expect(cleanedJson).toStrictEqual(expectedJson);
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
