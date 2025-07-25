import * as config from '../configuration/general.config'

describe('Database', () => {
    it('should have the correct values om data bases', () => {
      expect(config.default.controllerManual).toBeDefined();
    });
  });