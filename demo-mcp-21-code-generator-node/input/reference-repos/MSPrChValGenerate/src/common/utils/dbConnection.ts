/**
 * Clase para la conexion con la base de datos
 * @author Deivid Santiago Vargas
 */
import databaseConfig from "../configuration/database.config";
import { MongoClient } from 'mongodb';
import { Etask } from "./enums/taks.enum";
import Logging from "../lib/logging";
import { ELevelsErros } from "src/common/utils/enums/logging.enum";

/*
esta clase realiza una conexion a base datos y regresa una conexion para poder cerrarla posteriormente
en un try catch o finally 
@fpiceno
*/
export default class DbConnection{

  static logger = new Logging(DbConnection.name);

  public static async dbConnection(): Promise<any> {
    try {
      const url = databaseConfig.databaseCatalog;
      let client = new MongoClient(url);

      await client.connect();
      const db=client.db(databaseConfig.databaseNameHomes);
      
      return { client, db };
    } catch (error) {
      this.logger.write(' Error dbConnection()'+ error, Etask.ERROR_DATABASE_CONNECTIONHOMEATTRIBUTESPRICES, ELevelsErros.ERROR);
      
    }
    
  }



  /* genera una conexion a la base datos para el flujo home */
  public static async dbConnectionHomes(): Promise<any> {

    try {
      const url = databaseConfig.databaseCatalog;
      const client = new MongoClient(url);

      await client.connect();
      return client.db(databaseConfig.databaseNameHomes);
      
    } catch (error) {
      this.logger.write(' Error dbConnectionHomes()'+ error, Etask.ERROR_DATABASE_CONNECTIONHOMEATTRIBUTESPRICES, ELevelsErros.ERROR);
      
    }

  }

  /**
   * Metodo que genera una conexion a la base de datos de catalogo para insertar 
   * la informacion que se consume de la rest api de disponibilidad 
   * @returns 
   */
  public static async dbConnectionDisponibility(): Promise<any> {

    try {
      const url = databaseConfig.databaseCatalog;
      const client = new MongoClient(url);

      await client.connect();
      return client.db(databaseConfig.databaseNameHomes); 
      
    } catch (error) {
      this.logger.write(' Error dbConnectionDisponibility()'+ error, Etask.ERROR_GET_DATA_DISPONIBILITY_FILE, ELevelsErros.ERROR);
      
    }

  }

}