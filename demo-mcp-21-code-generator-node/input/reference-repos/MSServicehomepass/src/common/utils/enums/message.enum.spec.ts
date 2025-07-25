import { EmessageMapping, Swagger } from '../enums/message.enum';

describe('EmessageMapping should have correct values', () => {
  it('EmessageMapping" ', () => {
    expect(EmessageMapping.CHANNEL_ERROR).toBe('CHANNEL_ERROR');
    expect(EmessageMapping.DEFAULT_ERROR).toBe('DEFAULT_ERROR');
    expect(EmessageMapping.DEFAULT).toBe('DEFAULT');
  });

  it('total enums', () => {
    expect(Object.keys(EmessageMapping).length).toBe(17);
  });
});

describe('Swagger should have correct values', () => {
  it('Swagger" ', () => {
    expect(Swagger.SUCCESSFUL_RESPONSE).toBe('Respuesta satisfactoria al consumir el servicio de un producto con disponibilidad');
    expect(Swagger.WRONG_ANSWER).toBe('BAD REQUEST generado por error en el request de entrada');
    expect(Swagger.SERVER_ERROR).toBe('El microservicio ha presentado un error interno del lado del servidor.');
  });

  it('total enums', () => {
    expect(Object.keys(Swagger).length).toBe(14);
  });
});
