import * as config from '../configuration/database.config'

describe('Database', () => {
  it('correct value data bases', () => {
      expect(config.default.database).toContain('DBPRTProdOffeLoad_DE');
  });

  it('correct value data bases', () => {
      expect(config.default.databasePrices).toContain('DBPRTPrices_DE');
  });

  it('correct value data bases', () => {
      expect(config.default.databaseDisponibility).toContain('DBPRTDisponibility_DE');
  });

  it('correct value data bases', () => {
      expect(config.default.databaseFeatures).toContain('DBPRTFeatures_DE');
  });
});