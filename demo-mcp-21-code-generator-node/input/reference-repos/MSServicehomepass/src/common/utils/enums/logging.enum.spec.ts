import { ELevelsErrors, ELevelsErrorsGlobal } from './logging.enum';

describe('ELevelsErrorsGlobal should have correct values', () => {
  it('ELevelsErrorsGlobal" ', () => {
    expect(ELevelsErrorsGlobal.ALL).toBe('ALL');
    expect(ELevelsErrorsGlobal.ERROR).toBe('ERROR');
    expect(ELevelsErrorsGlobal.INFO).toBe('INFO');
    expect(ELevelsErrorsGlobal.OFF).toBe('OFF');
    expect(ELevelsErrorsGlobal.WARNING).toBe('WARN');
  });

  it('total enums', () => {
    expect(Object.keys(ELevelsErrorsGlobal).length).toBe(5);
  });
});

describe('ELevelsErrors should have correct values', () => {
  it('ELevelsErrors" ', () => {
    expect(ELevelsErrors.ERROR).toBe('error');
    expect(ELevelsErrors.INFO).toBe('info');
    expect(ELevelsErrors.WARNING).toBe('warn');
  });

  it('total enums', () => {
    expect(Object.keys(ELevelsErrors).length).toBe(3);
  });
});
