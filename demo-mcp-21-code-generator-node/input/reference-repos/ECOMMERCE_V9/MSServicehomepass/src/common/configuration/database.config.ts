/**
 * Se almacena la configuracion de la base de datos
 * @author Juan Esteban Romero
 */

let user_db = process.env.BD_USER || '';
let password_db = process.env.BD_PASSWORD || '';
const MONGO = process.env.MONGO || 'mongodb://127.0.0.1:27017/DBCOMServicehomepass_DE';

export default {
  database: MONGO.replace('bd_user', user_db).replace('bd_password', password_db),
  mongoReplicaSet:
    process.env.MONGO_REPLICA_SET === undefined
      ? true
      : process.env.MONGO_REPLICA_SET === 'true',
  connStr: {
    user: process.env.ORACLEDB_USER || '',
    password: process.env.ORACLEDB_PASSWORD || '',
    connectString: process.env.ORDBCONN || '',
  },
  timeout: process.env.DATABASE_TIMEOUT || 10000
};