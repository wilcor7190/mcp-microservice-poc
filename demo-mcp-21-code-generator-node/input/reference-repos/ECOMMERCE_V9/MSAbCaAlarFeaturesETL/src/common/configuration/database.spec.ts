import * as config from '../configuration/database.config'

describe('Database', () => {
  it('correct value data bases', () => {
      expect(config.default.database).toContain('mongodb://');
  });

  it('correct value data bases', () => {
      expect(config.default.databaseContingency).toContain('mongodb://');
  });
});