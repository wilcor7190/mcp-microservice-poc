export default {
  httpConfig: {
    timeout: Number(process.env.HTTP_TIMEOUT || 15000),
  }
};