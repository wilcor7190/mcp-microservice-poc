import * as config from '../configuration/services.config'

describe('process.env', () => {
  it('correct value endpoint coverage', () => {
      expect(config.default.httpConfig).toEqual({"timeout": 10000, "headersTimeout": 30000});
  });

  it('correct value endpoint coverage', () => {
    expect(config.default.testService).toContain("localhost");
  });

});