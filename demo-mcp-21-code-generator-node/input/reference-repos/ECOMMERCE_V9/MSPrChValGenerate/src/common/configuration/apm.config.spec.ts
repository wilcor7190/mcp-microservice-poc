import * as config from '../configuration/apm.config'

describe('Database', () => {
  it('should have the correct values on data bases', () => {
    expect(config.default.environment).toBeDefined();
  });

  it('should have the correct values on data bases', () => {
    expect(config.default.serviceName).toBeDefined();
  });

  it('should have the correct values on data bases', () => {
    expect(config.default.serverUrl).toBeDefined();
  });

  it('should have the correct values on data bases', () => {
    expect(config.default.captureBody).toBeDefined();
  });

  it('should have the correct values on data bases', () => {
    expect(config.default.captureHeaders).toBeDefined();
  });

  it('should have the correct values on data bases', () => {
    expect(config.default.logLevel).toBeDefined();
  });

  it('should have the correct values on data bases', () => {
    expect(config.default.captureBody).toBeDefined();
  });

  it('should have the correct values on data bases', () => {
    expect(config.default.active).toBeDefined();
  });

  it('should have the correct values on data bases', () => {
    expect(config.default.errorOnAbortedRequests).toBeDefined();
  });

});