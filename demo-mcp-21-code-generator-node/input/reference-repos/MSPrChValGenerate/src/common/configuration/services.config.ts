/**
 * Se almacena la configuracion del servicio y los legados que consume
 * @author alexisterzer
 */

const protocol = `https://`;

export default {
  httpConfig: {
    timeout: Number(process.env.HTTP_TIMEOUT || 10000),
    headersTimeout: Number(process.env.HTTP_HEADERS_TIMEOUT || 30000)
  },
  testService: process.env.TEST_SERVICE || 'http:/localhost:8181',

};

