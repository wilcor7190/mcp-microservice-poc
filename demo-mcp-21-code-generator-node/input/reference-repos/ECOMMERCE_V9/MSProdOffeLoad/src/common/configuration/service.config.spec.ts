import * as config from '../configuration/services.config'

describe('process.env', () => {
  it('correct value endpoint coverage', () => {
      expect(config.default.httpConfig).toEqual({"timeout": 15000});
  });
});