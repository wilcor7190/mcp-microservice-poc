import { ParamUcimpl } from '../../core/use-case/resource/impl/param.resource.uc.impl';
import { EtypeDocument } from './enums/params.enum';
import generalConfig from '../configuration/general.config';
import { EmessageMapping } from "./enums/message.enum";
import { MappingStatusCode } from '../configuration/mapping-statuscode';
import { BusinessException } from '../lib/business-exceptions';

import GeneralUtil from "./generalUtil";


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

  it('isEmpty is empty', async () => {
    let element1 = ''
    const result = await GeneralUtil.isEmpty(element1)
    expect(result).toBe(true)
  });

  it('isEmpty is no empty', async () => {
    let element1 = 'cadena'
    const result = await GeneralUtil.isEmpty(element1)
    expect(result).toBe(false)
  });

  it('isUndefined is true', async () => {
    let element1 = undefined
    const result = await GeneralUtil.isUndefined(element1)
    expect(result).toBe(true)
  });

  it('isUndefined is false', async () => {
    let element1 = 'cadena'
    const result = await GeneralUtil.isUndefined(element1)
    expect(result).toBe(false)
  });

  it('isNull is true', async () => {
    let element1 = null
    const result = await GeneralUtil.isNull(element1)
    expect(result).toBe(true)
  });

  it('isNull is false', async () => {
    let element1 = 'cadena'
    const result = await GeneralUtil.isNull(element1)
    expect(result).toBe(false)
  });

  
  it('isNullOrEmpty is null', async () => {
    let element1 = null
    const result = await GeneralUtil.isNullOrEmpty(element1)
    expect(result).toBe(true)
  });

  it('isNullOrEmpty is Empty', async () => {
    let element1 = ''
    const result = await GeneralUtil.isNullOrEmpty(element1)
    expect(result).toBe(true)
  });

  it('isNullOrEmpty is false', async () => {
    let element1 = 'cadena'
    const result = await GeneralUtil.isNullOrEmpty(element1)
    expect(result).toBe(false)
  });
  

})