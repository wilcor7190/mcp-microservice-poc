import { Etask, ETaskDesc } from './task.enum';

describe('Etask should have correct values', () => {
  it('Etask" ', () => {
    expect(Etask.CREATE).toBe('CREANDO_MOCKUP');
    expect(Etask.LOAD_PARAM).toBe('LOAD_PARAM');
    expect(Etask.ERROR_LOAD_PARAM).toBe('Error cargando parametros');
  });
  it('total enums', () => {
    expect(Object.keys(Etask).length).toBe(65);
  });
});

describe('ETaskDesc should have correct values', () => {
  it('ETaskDesc" ', () => {
    expect(ETaskDesc.CHANNEL).toBe('Validation of the channel');
    expect(ETaskDesc.CONSUMED_SERVICE).toBe('Result service');
    expect(ETaskDesc.UPDATE_PARAM).toBe('Actualizando parametros');
  });
  it('total enums', () => {
    expect(Object.keys(ETaskDesc).length).toBe(31);
  });
});
