/**
 * Se almacena la configuracion de la base de datos
 * @author Santiago Vargas
 */
let user_db = process.env.BD_USER || '';
let password_db = process.env.BD_PASSWORD || '';
const MONGO = process.env.MONGO || 'mongodb://127.0.0.1:27017/DBPRTProdOffeLoad_DE';
const MONGOPRICES = process.env.DBPRICES || 'mongodb://127.0.0.1:27017/DBPRTPrices_DE';
const MONGODISPONIBILITY = process.env.DBDISP || 'mongodb://127.0.0.1:27017/DBPRTDisponibility_DE';
const MONGOFEATURES = process.env.DBFEATURES || 'mongodb://127.0.0.1:27017/DBPRTFeatures_DE';

export default {
  database: MONGO.replace('bd_user', user_db).replace('bd_password', password_db),
  databasePrices: MONGOPRICES.replace('bd_user', user_db).replace('bd_password', password_db),
  databaseDisponibility: MONGODISPONIBILITY.replace('bd_user', user_db).replace('bd_password', password_db),
  databaseFeatures: MONGOFEATURES.replace('bd_user', user_db).replace('bd_password', password_db)
};