/**
 * Se almacena la configuracion del servicio
 * @author Edwin Avila
 */
const protocol = 'http://';

export default {
  httpConfig: {
    timeout: Number(process.env.HTTP_TIMEOUT || 10000),
    headersTimeout: Number(process.env.HTTP_HEADERS_TIMEOUT || 30000)
  },
  testService: process.env.TEST_SERVICE || `${protocol}localhost:8181`,
};
