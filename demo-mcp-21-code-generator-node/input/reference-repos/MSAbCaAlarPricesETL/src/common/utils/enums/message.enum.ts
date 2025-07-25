/**
 * Enumera la identificación de mensajes usados en el microservicio para mapear la respuesta de una petición api recibida
 * @author Fredy Santiago Martinez
 */

export enum EmessageMapping {
  CHANNEL_ERROR = 'CHANNEL_ERROR',
  DEFAULT_ERROR = 'DEFAULT_ERROR',
  DEFAULT = 'DEFAULT',
  ERROR_TIMEOUT_LEGACY = 'ERROR_TIMEOUT_LEGACY',
}

export enum ETaskMessageGeneral {
  GET_BY_ID = 'Obteniendo mensaje por ID',
  GET_ALL = 'Obteniendo todos los mensajes',
}

export enum Swagger {
  GENERATE_PRICES = 'Operación encargada de crear la data de prices',
  SUCCESSFUL_RESPONSE = 'Respuesta satisfactoría al consumir el servicio de precios.',
  BAD_REQUEST = 'BAD REQUEST generado por error en el request de entrada.',
}
