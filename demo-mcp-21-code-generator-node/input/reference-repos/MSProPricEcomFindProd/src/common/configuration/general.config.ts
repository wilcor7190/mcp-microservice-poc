/**
 * Se almacena la configuracion de los nombres de los métodos que se usan
 * @author Fredy Santiago Martinez
 */

export default {
  apiMapping: process.env.API_MAPPING || '/RSProPricEcomFindProd',
  apiVersion: process.env.API_VERSION || 'V1',
  controllerMessage: process.env.CONTROLLER_MESSAGE || '/Message',
  controllerskusond: process.env.CONTROLLER_SKUSOND || '/SKUsond',
  port: process.env.PORT || 8080,
  logLevel: process.env.LOG_LEVEL || 'ALL',
  ttlCache: Number(process.env.TTL_CACHE || 0)
}