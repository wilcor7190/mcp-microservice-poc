/**
 * Se almacena la configuracion de los nombres de los métodos que se usan
 * @author Santiago Vargas
 */
const SFTP_MODULE_USERNAME = process.env.SFTP_USER || 'cshv9qa';
const SFTP_MODULE_PASSWORD = process.env.SFTP_PASSWORD || 'gR&O&RW#hYfV';
const SFTP_READ_FILE_IMG_USERNAME = process.env.SFTP_IMG_USER || 'admin.claro';
const SFTP_READ_FILE_IMG_PASSWORD = process.env.SFTP_IMG_PASSWORD || 'RSWVRHt2dVMcqz';

const protocol = '';
export default {
  apiMapping: process.env.API_MAPPING || '/RSProdOffeLoad',
  apiVersion: process.env.API_VERSION || 'V1',
  controllerEvents: process.env.CONTROLLER_EVENTS || '/Events',
  port: process.env.PORT || 8080,
  logLevel: process.env.LOG_LEVEL || 'ALL',
  ttlCache: Number(process.env.TTL_CACHE || 0),
  logTrazabililty: (process.env.LOG_TRAZABILITY === 'true'),

  // Connection sftp
  sftpModuleHost: process.env.FILEHOST || `${protocol}172.22.94.68`,
  sftpModulePort: process.env.SFTP_MODULE_PORT || 22,
  sftpModuleUsername: SFTP_MODULE_USERNAME,
  sftpModulePassword: SFTP_MODULE_PASSWORD,

  // Connection sftp images
  sftpReadFileImgHost: process.env.IMGHOST || `${protocol}100.126.22.55`,
  sftpReadFileImgUsername: SFTP_READ_FILE_IMG_USERNAME,
  sftpReadFileImgPassword: SFTP_READ_FILE_IMG_PASSWORD,
  sftpModulePortReadImage: process.env.SFTP_MODULE_PORT_READ_IMAGE || 2222,
  sftpReadFileImgPath: process.env.SFTP_READ_FILE_IMG_PATH || '/cdn/imagenes/v9/catalogo/',
  sizeFullImage: process.env.SIZE_FULL_IMAGE || '646x1000/',
  sizeThumbnail: process.env.SEZE_THUMBNAIL || '70x110/',

  // Attachment-data
  endPointImage: process.env.END_POINT_IMAGE || 'https://cdn.demoqafront.claro.com.co/imagenes/v9/catalogo/',
  languageId: process.env.LANGUAGE_ID || '-1',

  // Product-inventory
  quantityMeasure: process.env.QUANTITY_MEASURE || 'C62',
  fulfillmentCenterName: process.env.FULFILLMENT_CENTER_NAME || 'Extended Sites Catalog Asset Store Home',

  // Name files
  productData: process.env.PRODUCT_DATA || 'claro-producto-data',
  salesCatalog: process.env.SALES_CATALOG_GROUP_CATALOG_ENTRIES || 'SalesCatalogGroupCatalogEntries',
  attributesProducts: process.env.ATTRIBUTES_PRODUCTS || 'claro-atributo-rel-producto',
  attributesDictionary: process.env.ATTRIBUTES_DICTIONARY || 'claro-diccionario-atributo',
  attachmentsData: process.env.ATTACHMENT_DATA || 'claro-attachments-data',
  productInventory: process.env.PRODUCT_INVENTORY_DATA || 'claro-producto-inventario',
  pricesCatalog: process.env.PRICES_CATALOG || 'claro-precios',

  // EndPoint files
  sftpRemotePath: process.env.SFTP_REMOTE_PATH || '/claroshopv9qa/claro/catlogue_dev/v9/B2C/',
  sftpRemotePathB2b: process.env.SFTP_REMOTE_PATH_B2B || '/claroshopv9qa/claro/catlogue_dev/v9/B2B/',
  sftpProductData: process.env.SFTP_PRODUCT_DATA || 'producto_data/',
  sftpSalesCatalog: process.env.SFTP_SALES_CATALOG || 'sales_catalog/',
  sftAttributeProduct: process.env.SFTP_ATTRIBUTES_PRODUCT || 'attribute_product/',
  sftAttributeDictionary: process.env.SFTP_ATTRIBUTES_DICTIONARY || 'attribute_dictionary/',
  sftAttachment: process.env.SFTP_ATTACHMENT || 'attachments_data/',
  sftProductInventory: process.env.SFTP_PRODUCT_INVENTORY || 'producto_inventory/',
  sftPriceListData: process.env.SFTP_PRICE_LIST_DATA || 'price_list_data/',

  // Kafka
  kafkaBroker: process.env.KAFKA_BROKER || '10.17.1.254:9095',
  kafkaIdGroup: process.env.KAFKA_ID_GROUP || 'kafka-ms-prod-offe-load',
  kafkaTopicFeatures: process.env.KAFKA_TOPIC_FEATURES || 'calendaralarmfeaturestopic',
  kafkaTopicDisponibility: process.env.KAFKA_TOPIC_DISPONIBILITY || 'calendaralarmdisponibilitytopic',
  kafkaTopicPrices: process.env.KAFKA_TOPIC_PRICES || 'calendaralarmpricestopic'
}