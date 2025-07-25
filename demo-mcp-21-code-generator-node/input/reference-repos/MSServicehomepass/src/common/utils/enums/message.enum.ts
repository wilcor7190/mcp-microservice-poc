/**
 * Enumera la identificación de mensajes usados en el microservicio para mapear la respuesta de una petición api recibida
 * @author Oscar Avila
 */
export enum EmessageMapping {
  CHANNEL_ERROR = 'CHANNEL_ERROR',
  CLIENTE_OPERACION = 'CLIENTE_OPERACION',
  DEFAULT = 'DEFAULT',
  DEFAULT_ERROR = 'DEFAULT_ERROR',
  ERROR_DIREC_NO_ENCONTRADA = 'ERROR_DIREC_NO_ENCONTRADA',
  ERROR_DIRECCION_SIN_HHPP = 'ERROR_DIRECCION_SIN_HHPP',
  ERROR_TIMEOUT_INESTABILIDAD_SP = 'ERROR_TIMEOUT_INESTABILIDAD_SP',
  LEGADO_ERROR = 'LEGADO_ERROR',
  NO_DATA_FOUND = 'NO_DATA_FOUND',
  SOURCE_ADDRESS = 'SOURCE_ADDRESS',
  VALIDACION_STRATUM = 'VALIDACION_STRATUM',
  VALIDATION_FIELD_ERROR = 'VALIDATION_FIELD_ERROR',
  CON_SERVICIO = 'CON_SERVICIO',
  CON_COBERTURA = 'CON_COBERTURA',
  SIN_COBERTURA = 'SIN_COBERTURA',
  DIRECCION_SIN_COBERTURA = 'DIRECCION_SIN_COBERTURA',
  TIMEOUT = 'TIMEOUT',
}

export enum ETaskMessageGeneral {
  GET_BY_ID = 'Obteniendo mensaje por ID',
  GET_ALL = 'Obteniendo todos los mensajes',
  PERFORM_JOB = 'Gestionando los estados de las solicitudes homepass con estado pendiente ',
  DATOS_FOUND_CUSREQUESTHOMEPASS = 'Se encontraron datos EN CUSREQUESTHOMEPASS',
  DATOS_UPTATE_CUSREQUESTHOMEPASS = '',
  PUT_BUSCAR_SOCILITUD_POR_Id_SOLICITUD = 'El legado  CMatricesAs400Services operación buscarSolicitudPorIdSolicitud entrego una respuesta',
  HHPP_CREADO_Y_ESTADO_FINALIZADO = 'El resultado = CREADO y estado = FINALIZADO',
  HHPP_PENDIENTE_Y_ESTADO_VACIO = "El resultado = PENIENTE y estado = '' ",
  TIMEOUT_CMATRICES = 'Timeout del legado CMatricesAs400Services operación buscarSolicitudPorIdSolicitud',
  DATOS_UPDATE_CUSREQUESTHOMEPASS = 'Se actualizarion datos EN CUSREQUESTHOMEPASS',
  SENDORDER = 'Se realiza consulta de send order',
  PAYMENT = 'Se realiza consulta de payment',
  CAPACITY = 'Se realiza consulta de capacity',
  CREATEORDER = 'Se realiza consulta de create order',
}

export enum Swagger {
  GET_SERVICE_ERROR = 'consult general',
  POST_CLIENT_HOMEPASS = 'Relaciona un cliente con una solicitud homepass',
  POST_STRUCTURES_HOMEPASS = 'Consulta de un barrio o barrios por parte del departamento y municipio enviado',
  GET_NEIGHBORHOOSBYDANE = 'Consulta de detalles de dirección',
  GET_JOB = 'Petición de job',
  POST_HOMEPASS = 'valida la cobertura de red de una dirección de cliente.',
  POST_DETAIL_DESCRIPTION = 'Consulta de dirección detallada',
  POST_ADDRESS_DESCRIPTION = 'consulta de ordenes generales',
  VALIDATE_DESCRIPTION = 'Operación de la API que se encarga de validar la disponibilidad del producto',
  SUCCESSFUL_RESPONSE = 'Respuesta satisfactoria al consumir el servicio de un producto con disponibilidad',
  WRONG_ANSWER = 'BAD REQUEST generado por error en el request de entrada',
  SERVER_ERROR = 'El microservicio ha presentado un error interno del lado del servidor.',
  INTERNAL_SERVER_ERROR = 'Se genera en caso de desarrollarse una excepción no controlada',
  FAILED_RESPONSE = 'Respuesta fallida al consumir el servicio de un producto sin disponibilidad',
}
