import * as config from './general.config';

describe('Database', () => {
  it('should have the correct values om data bases', () => {
    expect(config.default.controllerCoverageDetailAddress).toContain('/Coverage/detailAddress');
  });
});
