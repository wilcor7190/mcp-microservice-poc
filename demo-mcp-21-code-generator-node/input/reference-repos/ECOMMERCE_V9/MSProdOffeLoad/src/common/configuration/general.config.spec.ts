import * as config from './general.config'

describe('General Config', () => {
  it('correct values controller Events', () => {
      expect(config.default.controllerEvents).toBeDefined();
  });

  it('correct values apiMapping', () => {
      expect(config.default.apiMapping).toContain('/RSProdOffeLoad');
  });
});