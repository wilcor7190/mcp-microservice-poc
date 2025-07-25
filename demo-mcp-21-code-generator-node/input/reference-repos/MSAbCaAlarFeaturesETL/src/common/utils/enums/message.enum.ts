/**
 * Enumera la identificación de mensajes usados en el microservicio para mapear la respuesta de una petición api recibida
 * @author Santiago Vargas
 */

export enum EmessageMapping {
    CHANNEL_ERROR = 'CHANNEL_ERROR',
    DEFAULT_ERROR = 'DEFAULT_ERROR',
    DEFAULT = 'DEFAULT',
    PROCSALE_FOUND = 'PROCSALE_FOUND',
    LEGACY_FOUND = 'LEGACY_FOUND',
    TYPEDOC = 'TYPEDOC',
    LEGACY = 'LEGACY',
    INSPIRA = 'INSPIRA',
    OPERATION = 'OPERATION',
    CLIENT_OPERATION = 'CLIENT_OPERATION',
    CLIENT_OPERATION_MESSAGE = 'CLIENT_OPERATION_MESSAGE',
    SUCCESFUL_SEND_PIN = 'SUCCESFUL_SEND_PIN',
    ERROR_CONTACT_MEDIUM = 'ERROR_CONTACT_MEDIUM',
    RETRIES_EXCEEDED = 'RETRIES_EXCEEDED',
    SUCCESSFUL = 'SUCCESSFUL',
    NOT_SUCCESSFUL = 'NOT_SUCCESSFU',
    DOCUMENT_EXIST = 'DOCUMENT_EXIST',
    EMAIL_EXIST = 'EMAIL_EXIST',
    ERROR_REQUIRED_FIELDS = 'ERROR_REQUIRED_FIELDS',
    REQUIRED_FIELDS = 'REQUIRED_FIELDS',
    DOCUMENT_FIELD = 'DOCUMENT_FIELD',
    VALIDACION_EXITOSA = 'VALIDACION_EXITOSA',
    VALIDACION_NO_EXITOSA = 'VALIDACION_NO_EXITOSA',
    ERROR_TIMEOUT_LEGADO = 'ERROR_TIMEOUT_LEGADO',
    ERROR_TIMEOUT_LEGADO_OR_LEAVING_YOUR_DATA = 'ERROR_TIMEOUT_LEGADO_OR_LEAVING_YOUR_DATA',
    PIN_VALIDATION_SUCCESFUL = 'PIN_VALIDATION_SUCCESFUL',
    INCORRECT_PIN = 'INCORRECT_PIN',
    USER_DATA_NOT_FOUND = 'USER_DATA_NOT_FOUND',
    ADDRESS_NOT_FOUND = 'ADDRESS_NOT_FOUND',
}


export enum ETaskMessageGeneral {
    GET_BY_ID = "Obteniendo mensaje por ID",
    GET_ALL = "Obteniendo todos los mensajes"
}

export enum Swagger {
    UPDATE_FEATURE = 'Operación encargada de actualizar las caracteristicas por categoría',
    SUCCESSFUL_RESPONSE = 'Respuesta satisfactoría al consumir el servicio.',
    WRONG_ANSWER = 'Error generado por falta de información en las categorías.',
    SERVER_ERROR = 'The microservice has presented an internal error on the server side.',
    BAD_REQUEST = 'BAD REQUEST generado por error en el request de entrada.'
}