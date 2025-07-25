import * as config from './apm.config';

describe('Database', () => {
  it('should have the correct values om data bases', () => {
    expect(config.default.environment).toBeDefined();
  });
});
