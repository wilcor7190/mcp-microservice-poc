/**
 * Se almacena la configuracion del servicio y los legados que consume
 * @author Santiago Vargas
 */

export default {
  httpConfig: {
    timeout: Number(process.env.HTTP_TIMEOUT || 15000),
  }
};