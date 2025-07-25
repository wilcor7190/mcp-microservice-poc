import databaseConfig from "../configuration/database.config"


describe('dbConfig catalog should have correct values', () => {
    it('dbConecction', () => {
      expect(databaseConfig.databaseNameHomes).toBe("DBPRTCATALOG_DE")
    
    })
  
})