import * as config from './general.config'

describe('General Config', () => {
  it('correct values controller', () => {
      expect(config.default.contingencyController).toBeDefined();
  });

  it('correct values generalConfig', () => {
      expect(config.default.apiMapping).toContain('/MSPrChValGenerate');
  });

  it('correct values generalConfig', () => {
    expect(config.default.apiVersion).toContain('V1');
  });

  it('correct values generalConfig', () => {
    expect(config.default.controllerMessage).toContain('Message');
  });

  it('correct values generalConfig', () => {
    expect(config.default.jobConvertionController).toContain('jobConvertion');
  });

  it('correct values generalConfig', () => {
    expect(config.default.controllerError).toContain('errors');
  });

  it('correct values generalConfig', () => {
    expect(config.default.port).toBe(8080);
  });

  it('correct values generalConfig', () => {
    expect(config.default.logLevel).toContain('ALL');
  });

  it('correct values generalConfig', () => {
    expect(config.default.ttlCache).toBe(0);
  });

  it('correct values generalConfig', () => {
    expect(config.default.sftpModuleHost).toContain('172.22.94.68');
  });

  it('correct values generalConfig', () => {
    expect(config.default.sftpModulePort).toBe("22");
  });

  it('correct values generalConfig', () => {
    expect(config.default.sftpModuleUsername).toBe('cshv9qa');
  });

  it('correct values generalConfig', () => {
    expect(config.default.sftpModulePassword).toBe('gR&O&RW#hYfV');
  });

  it('correct values generalConfig', () => {
    expect(config.default.cronExecutionFeatures).toContain('0 0-23/1');
  });

  it('correct values generalConfig', () => {
    expect(config.default.cronExecutionSPMovil).toContain('0 0-23/1');
  });

  it('correct values generalConfig', () => {
    expect(config.default.cronExecutionFeaturesPricesTyT).toContain('0 0-23/1');
  });

  it('correct values generalConfig', () => {
    expect(config.default.cronExecutionMobilePricesAttributes).toContain('0 0-23/1');
  });

  it('correct values generalConfig', () => {
    expect(config.default.cronExecutionHomesPricesAttributes).toContain('0 0-23/1');
  });

  it('correct values generalConfig', () => {
    expect(config.default.paginationDB).toBe(100);
  });

  it('correct values generalConfig', () => {
    expect(config.default.origenJob).toContain('JOBPrChValGenerateSP');
  });

  it('correct values generalConfig', () => {
    expect(config.default.specificationSubtype).toContain('Telefono');
  });

  it('correct values generalConfig', () => {
    expect(config.default.specificationSubtypePos).toContain('Movil');
  });

  it('correct values generalConfig', () => {
    expect(config.default.specificationSubtypePre).toContain('Movil');
  });

  it('correct values generalConfig', () => {
    expect(config.default.servicesOmnLimit).toBe(100);
  });

  it('correct values generalConfig', () => {
    expect(config.default.disponibilityManualController).toContain('loadManual');
  });


  it('correct values generalConfig', () => {
    expect(config.GlobalReqOrigin.globalOrigin).toBeUndefined();
  });

  it('correct values generalConfig', () => {
    expect(config.GlobalReqOrigin.client).toBeUndefined();
  });

  it('correct values generalConfig', () => {
    expect(config.GlobalReqOrigin.request).toBeUndefined();
  });

  it('correct values generalConfig', () => {
    expect(config.GlobalReqOrigin.requestHeaders).toBeUndefined();
  });
});