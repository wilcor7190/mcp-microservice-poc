import { LegadosJob } from './legadosJob.enum';

describe('EmessageMapping should have correct values', () => {
  it('EmessageMapping" ', () => {
    expect(LegadosJob.APROBADO).toBe('APROBADO');
    expect(LegadosJob.COLLECTIONVALUE).toBe(0);
    expect(LegadosJob.QUANTITY).toBe(1);
    expect(LegadosJob.COLLECTIONVALUEPRODUCT).toBe(0);
    expect(LegadosJob.COLLECTIONVALUEUSIM).toBe(0);
    expect(LegadosJob.COLLECTIONVALUESERVICEADD).toBe(0);
    expect(LegadosJob.USER).toBe('YFONSECA');
    expect(LegadosJob.PASSWORD).toBe('PRUEBA');
    expect(LegadosJob.DCE021).toBe('DCE021');
    expect(LegadosJob.DNA102).toBe('DNA102');
  });

  it('total enums', () => {
    expect(Object.keys(LegadosJob).length).toBe(12);
  });
});
