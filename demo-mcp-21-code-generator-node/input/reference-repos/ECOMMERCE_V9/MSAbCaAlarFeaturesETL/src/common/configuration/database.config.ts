/**
 * * Se almacena la configuracion de la base de datos
 * @author Santiago Vargas
 */

let user_db = process.env.BD_USER || '';
let password_db = process.env.BD_PASSWORD || '';
const MONGO = process.env.MONGO || 'mongodb://127.0.0.1:27017/DBPRTFeatures_DE';
const MONGOCATALOGUECONTINGENCE = process.env.MONGOCATALOGUECONTINGENCE || 'mongodb://127.0.0.1:27017/DBPRTPRODUCTOFFERING_DE';


export default {
  database: MONGO.replace('bd_user', user_db).replace('bd_password', password_db),
  databaseContingency: MONGOCATALOGUECONTINGENCE.replace('bd_user', user_db).replace('bd_password', password_db),
  dbFeatures: process.env.DB_FEATURE || 'DBPRTFeatures_DE',
  dbContingency: process.env.DB_CONTINGENCE || 'DBPRTPRODUCTOFFERING_DE'
};
