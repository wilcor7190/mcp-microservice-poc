/**
 * Se almacena la configuracion de la base de datos
 * @author alexisterzer
 */
let user_db = process.env.BD_USER || '';
let password_db = process.env.BD_PASSWORD || '';
const MONGO =  process.env.MONGO || 'mongodb://127.0.0.1:27017/DBPRTPRODUCTOFFERING_DE';
const MONGOCATALOG =  process.env.MONGOCATALOG || 'mongodb://127.0.0.1:27017/DBPRTCATALOG_DE';

export default {
  database: MONGO.replace('bd_user', user_db).replace('bd_password', password_db),
  databaseCatalog: MONGOCATALOG.replace('bd_user', user_db).replace('bd_password', password_db),
   //--
  databaseName: process.env.DBNAMEPRTOFFERING || 'DBPRTPRODUCTOFFERING_DE', 
  databaseNameHomes: process.env.DBNAMECATALOG || 'DBPRTCATALOG_DE',
};
