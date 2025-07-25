import { EmessageMapping, Swagger } from '../enums/message.enum';

describe('EmessageMapping should have correct values', () => {
  it('EmessageMapping" ', () => {
    expect(EmessageMapping.CHANNEL_ERROR).toBe("CHANNEL_ERROR")
    expect(EmessageMapping.DEFAULT_ERROR).toBe("DEFAULT_ERROR")
    expect(EmessageMapping.DEFAULT).toBe("DEFAULT")
  });

  it('total enums', () => {
    expect(Object.keys(EmessageMapping).length).toBe(4);
  });
});

describe('Swagger should have correct values', () => {
  it('Swagger" ', () => {
    expect(Swagger.SUCCESSFUL_RESPONSE).toBe("Respuesta satisfactoría al consumir el servicio con dataload y categoría validos.");
    expect(Swagger.WRONG_ANSWER).toBe("The microservice shows an erroneous response to the request that was made.")
    expect(Swagger.SERVER_ERROR).toBe("The microservice has presented an internal error on the server side.")
    expect(Swagger.BAD_REQUEST).toBe("BAD REQUEST generado por error en el request de entrada.")
    expect(Swagger.GENERATE_DATALOAD).toBe("Operación encargada de la creación de un archivo (dataload) con la información para la tienda Ecommerce.")
  });

  it('total enums', () => {
    expect(Object.keys(Swagger).length).toBe(5);
  });
});

