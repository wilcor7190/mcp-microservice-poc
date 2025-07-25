import { EValidationHomepass } from './homepass.enum';

describe('EmessageMapping should have correct values', () => {
  it('EmessageMapping" ', () => {
    expect(EValidationHomepass.SIN_COBERTURA).toBe('No existe cobertura en esta direccion.');
    expect(EValidationHomepass.CON_COBERTURA).toBe('Existe cobertura en esta direccion.');
    expect(EValidationHomepass.CON_SERVICIO).toBe('En la dirección ingresada se encuentra instalado un servicio Claro.');
    expect(EValidationHomepass.DEFAULT).toBe('Por Defecto');
  });

  it('total enums', () => {
    expect(Object.keys(EValidationHomepass).length).toBe(7);
  });
});
