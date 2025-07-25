import * as config from '../configuration/apm.config'

describe('Database', () => {
  it('should have the correct values om data bases', () => {
    expect(config.default.enviroment).toBeDefined();
  });
});