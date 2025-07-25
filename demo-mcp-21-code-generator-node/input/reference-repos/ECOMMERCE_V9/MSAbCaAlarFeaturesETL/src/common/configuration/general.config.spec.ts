import * as config from './general.config'

describe('General Config', () => {
  it('correct values controller Events', () => {
      expect(config.default.controllerCategories).toBeDefined();
  });

  it('correct values apiMapping', () => {
      expect(config.default.apiMapping).toContain('/RSAbsoluteCalendarAlarmFeaturesETL');
  });
});