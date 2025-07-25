import * as config from '../configuration/database.config'

describe('Database', () => {
  it('should have the correct values on data bases', () => {
    expect(config.default.database).toContain('mongodb');
  });

  it('should have the correct values on data bases', () => {
    expect(config.default.databaseName).toContain('DBPRTPRODUCTOFFERING_DE');
  });

  it('should have the correct values on data bases', () => {
    expect(config.default.databaseCatalog).toContain('DBPRTCATALOG_DE');
  });

  it('should have the correct values on data bases', () => {
    expect(config.default.databaseNameHomes).toContain('DBPRTCATALOG_DE');
  });

});