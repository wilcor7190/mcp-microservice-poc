import * as config from './services.config';

describe('process.env', () => {
  it('should have the correct values', () => {
    expect(config.default.testService).toBeDefined();
  });
});
