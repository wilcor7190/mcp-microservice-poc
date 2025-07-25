/**
 * Se almacena la configuracion de la base de datos
 * @author Fredy Santiago Martinez
 */
export default {
  database: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/DBTemplateNestJS_DE',
};
