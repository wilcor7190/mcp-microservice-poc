import * as config from '../configuration/services.config'

describe('process.env', () => {
  it('should have the correct values', () => {
    expect(config.default.httpConfig.timeout).toBeDefined();
  });
});