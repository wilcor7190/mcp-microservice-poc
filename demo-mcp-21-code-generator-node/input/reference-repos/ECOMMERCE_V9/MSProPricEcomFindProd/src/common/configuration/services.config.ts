/**
 * Se almacena la configuracion del servicio
 * @author Edwin Avila
 */
const protocol = 'http://'

export default {
  httpConfig: {
    timeout: Number(process.env.HTTP_TIMEOUT || 15000),
  },
  testService: process.env.TEST_SERVICE || `http://localhost:8181/V1/Message`,
  inventoryManage: process.env.INVENTORYMANAGER|| `${protocol}msproductinventorymanage-omndev.apps.r05oof71.eastus2.aroapp.io/products/getChild`,
  '@type':process.env.TYPE || 'APIMProPricEcomFindProd',
  'channel/@type':process.env.CHANNEL_TYPE || 'ChannelRef',
  'channel/href':process.env.CHANNEL_HREF || `https://broker-comercial.claro.com.co/APIM/PRT/Product/RSProductPriceValidate/V1/ProductPrice/channel/EC_B2C`,
  'channel/id':process.env.CHANNEL_ID || 'EC9_B2C' || 'EC9_B2B',
  'channel/name': process.env.NAMEECOMM || 'eCommerce',
  'contextCharacteristic/@type': process.env.CHARACTERISTICTYPE || 'ObjectCharacteristic',
  'contextCharacteristic/name':process.env.CHARACTERISTICNAME || 'OMS sku child Configuration',
  'value/@type': process.env.CHARACTERISTICVALUETYPE || 'OMS Backend',
};