import { ETaskDesc, ETaskTrace, Etask } from "./taks.enum"

describe('Etask should have correct values', () => {
  it('Etask', () => {
    expect(Etask.CREATE).toBe("PROCESS_CREATE")
    expect(Etask.CHANNEL).toBe("VALIDATE_CHANNEL")
    expect(Etask.LOAD_MESSAGE).toBe("CARGANDO_MENSAJES")
    expect(Etask.ERROR_LOAD_PARAM).toBe("ERROR_CARGANDO_PARAMETROS")
    expect(Etask.CONSUMED_SERVICE).toBe("CONSUMED_SERVICE")
    expect(Etask.VALIDATE_REQUEST).toBe("VALIDATE_REQUEST")
    expect(Etask.MAP_FEATURES).toBe("MAPEANDO CARACTERISTICAS")
    expect(Etask.UPDATE_FEATURES).toBe("ACTUALIZANDO CARACTERISTICAS")
    expect(Etask.INSERT_FEATURES).toBe("INSERTANDO CARACTERISTICAS")
    expect(Etask.DELETE_FEATURES).toBe("BORRANDO CARACTERISTICAS")
    expect(Etask.CREATE_IMAGES).toBe("CREANDO IMAGENES")
    expect(Etask.EXEC_CRON_CATEGORIES).toBe("EJECUCIÓN CRON CATEGORIAS")
    expect(Etask.END_UPDATE_FEATURES).toBe("FIN ACTUALIZACIÓN CARACTERISTICAS")
    expect(Etask.EMIT_KAFKA).toBe("EMITIENDO EVENTO KAFKA")
    expect(Etask.FIND_CONTINGENCY).toBe("CONSULTANDO DATA CONTINGENCIA")
    expect(Etask.FIND_PRICES).toBe("CONSULTANDO PRECIOS")
    expect(Etask.FIND_AVAILABLE_FEATURES).toBe("CONSULTANDO CARACTERISTICAS HABILITADAS")
    expect(Etask.CROSS_DATA).toBe("CRUZANDO INFORMACIÓN")
    expect(Etask.LIST_PARENTS).toBe("CONFIGURACION PADRES-HIJOS")
    expect(Etask.SAVE_LIST_PARENTS).toBe("GUARDANDO PADRES-HIJOS")
    expect(Etask.FIND_DATA).toBe("CONSULTANDO CATALOGOS")
  })

  it('total enums', () => {
    expect(Object.keys(Etask).length).toBe(30)
  })
})

describe('ETaskDesc should have correct values', () => {
  it('ETaskDesc', () => {
    expect(ETaskDesc.CHANNEL).toBe("Validation of the channel")
    expect(ETaskDesc.ERROR_LOAD_PARAM).toBe("Error cargando parametros")
    expect(ETaskDesc.ERROR_MAP_FEATURES).toBe("ERROR MAPENADO CARACTERISTICAS")
    expect(ETaskDesc.ERROR_UPDATE_FEATURES).toBe("ERROR ACTUALIZANDO CARACTERISTICAS")
    expect(ETaskDesc.ERROR_INSERT_FEATURES).toBe("ERROR INSERTANDO CARACTERISTICAS")
    expect(ETaskDesc.ERROR_DELETE_FEATURES).toBe("ERROR BORRANDO CARACTERISTICAS")
    expect(ETaskDesc.START_UPDATE_FEATURES).toBe("Inicia el proceso de actualización de caracteristicas")
    expect(ETaskDesc.FINAL_FEATURES_UPDATE).toBe("Caracteristicas actualizadas")
    expect(ETaskDesc.START_FEATURES_UPDATE_JOB).toBe("Inicia el mapeo de caracteristicas desde el job")
    expect(ETaskDesc.ERROR_EMIT_KAFKA).toBe("Error emitiendo evento kafka")
    expect(ETaskDesc.ERROR_CROSS_DATA).toBe("Error cruzando información de precios")
  })

  it('total enums', () => {
    expect(Object.keys(ETaskDesc).length).toBe(17)
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

