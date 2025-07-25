import { ETaskDesc, ETaskTrace, Etask } from "./taks.enum"

describe('Etask should have correct values', () => {
  it('Etask', () => {
    expect(Etask.ERROR_PROVIDER).toBe("ERROR PROVIDER")
    expect(Etask.UPLOAD_FILE).toBe("SUBIENDO ARCHIVO")
    expect(Etask.READ_FILE).toBe("LEYENDO ARCHIVO")
    expect(Etask.END_CONNECTION).toBe("FIN DE LA CONEXION")
    expect(Etask.CREATE).toBe("PROCESS_CREATE")
    expect(Etask.CHANNEL).toBe("VALIDATE_CHANNEL")
    expect(Etask.PROCESS_KAFKA_ERROR_EVENT).toBe("EVENTO KAFKA INCORRECTO")
    expect(Etask.PROCESS_KAFKA_EVENT).toBe("EVENTO ACEPTADO")
    expect(Etask.DATALOAD_MANUAL).toBe("GENERANDO DATALOAD MANUAL")
    expect(Etask.FIND_EQUIPMENT).toBe("CONSULTANDO CATALOGOS TERMINALES")
    expect(Etask.FIND_TECHNOLOGY).toBe("CONSULTANDO CATALOGOS TECNOLOGÍA")
    expect(Etask.FIND_POSPAGO).toBe("CONSULTANDO CATALOGOS POSPAGO")
    expect(Etask.FIND_PREPAGO).toBe("CONSULTANDO CATALOGOS PREPAGO")
    expect(Etask.FIND_HOMES).toBe("CONSULTANDO CATALOGOS HOGARES")
    expect(Etask.FIND_DISPONIBILITY).toBe("CONSULTANDO DISPONIBILIDAD")
    expect(Etask.FIND_PRICES).toBe("CONSULTANDO PRECIOS")
    expect(Etask.FIND_LIST_PARENTS).toBe("CONSULTANDO PADRES-HIJOS")
    expect(Etask.FIND_DATA).toBe("CONSULTANDO INFORMACIÓN")
    expect(Etask.SAVE_LIST_PARENTS).toBe("GUARDANDO PADRES-HIJOS")
    expect(Etask.GENERATE_CSV).toBe("GENERANDO ARCHIVO CSV")
    expect(Etask.GET_IMAGES).toBe("OBTENIENDO IMAGENES")
    expect(Etask.CREATE_PRODUCT_DATA).toBe("CREANDO PRODUCT-DATA")
    expect(Etask.CREATE_SALES_CATALOG).toBe("CREANDO SALES-CATALOG")
    expect(Etask.CREATE_ATTRIBUTES_PRODUCT).toBe("CREANDO ATTRIBUTES-PRODUCTS")
    expect(Etask.CREATE_ATTRIBUTES_DICTIONARY).toBe("CREANDO ATTRIBUTES-DICTIONARY")
    expect(Etask.CREATE_ATTACHMENT_DATA).toBe("CREANDO ATTACHMENT-DATA")
    expect(Etask.CREATE_PRODUCT_INVENTORY).toBe("CREANDO PRODUCT-INVENTORY")
    expect(Etask.CREATE_PRICE_LIST).toBe("CREANDO PRICE-LIST")
    expect(Etask.START_MAP_PRICES).toBe("INICIA EL REGISTRO DE PRECIOS")
    expect(Etask.END_MAP_PRICES).toBe("FIN DEL REGISTRO DE PRECIOS")
  })

  it('total enums', () => {
    expect(Object.keys(Etask).length).toBe(47)
  })
})

describe('ETaskDesc should have correct values', () => {
  it('ETaskDesc', () => {
    expect(ETaskDesc.ERROR_GENERATE_DATALOAD).toBe("Error generando dataload")
    expect(ETaskDesc.ERROR_KAFKA_EVENT).toBe("Error orquestando dataload kafka")
    expect(ETaskDesc.INVALID_DATALOAD).toBe("Dataload invalido")
    expect(ETaskDesc.INVALID_CATEGORY).toBe("Categoria invalida")
    expect(ETaskDesc.ERROR_FIND_DATA).toBe("Error consultando información")
    expect(ETaskDesc.ERROR_GROUP_PRODUCTS).toBe("Error agrupando productos")
    expect(ETaskDesc.ERROR_GENERATE_PARENTS).toBe("Error generando padres")
    expect(ETaskDesc.ERROR_GENERATE_ROWS).toBe("Error generando filas")
    expect(ETaskDesc.ERROR_CREATE_FILE).toBe("Error creando archivo")
    expect(ETaskDesc.ERROR_SAVE_LIST_PARENTS).toBe("Error guardando lista de padres")
    expect(ETaskDesc.ERROR_GET_LIST_PARENTS).toBe("Error consultando lista de padres")
    expect(ETaskDesc.INVALID_IMAGES).toBe("No se encontraron imagenes")
    expect(ETaskDesc.INVALID_DATA).toBe("No se encontro información")
    expect(ETaskDesc.ERROR_SFTP).toBe("Error guardando archivo sftp")
    expect(ETaskDesc.ERROR_FIND_IMAGES).toBe("Error consultando imagenes")
    expect(ETaskDesc.KAFKA_EVENT_FEATURES).toBe("Procesando topic CalendarAlarmFeaturesTopic")
    expect(ETaskDesc.KAFKA_EVENT_PRICES).toBe("Procesando topic CalendarAlarmPricesTopic")
    expect(ETaskDesc.KAFKA_EVENT_DISPONIBILITY).toBe("Procesando topic CalendarAlarmDisponibilityTopic")
  })

  it('total enums', () => {
    expect(Object.keys(ETaskDesc).length).toBe(24)
  })
})

describe('ETaskTrace should have correct values', () => {
  it('ETaskTrace', () => {
    expect(ETaskTrace.FAILED).toBe("FAILED")
    expect(ETaskTrace.SUCCESS).toBe("SUCCESS")
  })

  it('total enums', () => {
    expect(Object.keys(ETaskTrace).length).toBe(2)
  })
})

