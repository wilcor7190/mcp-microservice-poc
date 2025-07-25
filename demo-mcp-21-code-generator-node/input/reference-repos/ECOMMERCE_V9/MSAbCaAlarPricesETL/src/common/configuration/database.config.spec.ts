import * as config from '../configuration/database.config'

describe('Database', () => {
  it('should have the correct values om data bases', () => {
    expect(config.default.database).toContain('mongodb');
  });
});

describe('Database', () => {
    it('should have the correct values om data bases', () => {
      expect(config.default.databaseProductOffering).toContain('mongodb');
    });
  });