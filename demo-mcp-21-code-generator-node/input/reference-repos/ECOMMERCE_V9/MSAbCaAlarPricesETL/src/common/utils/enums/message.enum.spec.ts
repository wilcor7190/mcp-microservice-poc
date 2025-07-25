import { ETaskMessageGeneral, EmessageMapping, Swagger } from '../enums/message.enum';

describe('EmessageMapping should have correct values', () => {

  it('CHANNEL_ERROR should be "CHANNEL_ERROR" ', () => {
    expect(EmessageMapping.CHANNEL_ERROR).toBe("CHANNEL_ERROR");
  });

  it('DEFAULT_ERROR should be --> "DEFAULT_ERROR"', () => {
    expect(EmessageMapping.DEFAULT_ERROR).toBe("DEFAULT_ERROR");
  });
  it('DEFAULT should be --> "DEFAULT"', () => {
    expect(EmessageMapping.DEFAULT).toBe("DEFAULT");
  });

   it('total eneums', () => {
    expect(Object.keys(EmessageMapping).length).toBe(4);
  });

});

describe('ETaskMessageGeneral should have correct values', () => {

  it('GET_BY_ID should be "GET_BY_ID" ', () => {
    expect(ETaskMessageGeneral.GET_BY_ID).toBe("Obteniendo mensaje por ID");
  });

  it('GET_ALL should be --> "GET_ALL"', () => {
    expect(ETaskMessageGeneral.GET_ALL).toBe("Obteniendo todos los mensajes");
  });

   it('total eneums', () => {
    expect(Object.keys(ETaskMessageGeneral).length).toBe(2);
  });

});

describe('Swagger should have correct values', () => {

  it('GENERATE_PRICES should be "GENERATE_PRICES" ', () => {
    expect(Swagger.GENERATE_PRICES).toBe("Operación encargada de crear la data de prices");
  });

  it('SUCCESSFUL_RESPONSE should be --> "SUCCESSFUL_RESPONSE"', () => {
    expect(Swagger.SUCCESSFUL_RESPONSE).toBe("Respuesta satisfactoría al consumir el servicio de precios.");
  });

  it('BAD_REQUEST should be --> "BAD_REQUEST"', () => {
    expect(Swagger.BAD_REQUEST).toBe("BAD REQUEST generado por error en el request de entrada.");
  });

   it('total eneums', () => {
    expect(Object.keys(Swagger).length).toBe(3);
  });

});