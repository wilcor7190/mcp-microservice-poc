/**
 * @author Oscar Robayo
 * Clase encargada de almacenar la conexion de la base de datos
 */
let user_db = process.env.BD_USER || '';
let password_db = process.env.BD_PASSWORD || '';
const MONGO = process.env.MONGO || 'mongodb://127.0.0.1:27017/DBPRTPrices_DE';
const MONGOURLPRODUCTOFFERING = process.env.MONGOURLPRODUCTOFFERING || 'mongodb://127.0.0.1:27017/DBPRTPRODUCTOFFERING_DE';

export default {
  database: MONGO.replace('bd_user', user_db).replace('bd_password', password_db),
  databaseProductOffering: MONGOURLPRODUCTOFFERING.replace('bd_user', user_db).replace('bd_password', password_db),
  collectionNamePrices: process.env.DBNAMECATALOGPRICE || 'DBPRTPrices_DE'
};
