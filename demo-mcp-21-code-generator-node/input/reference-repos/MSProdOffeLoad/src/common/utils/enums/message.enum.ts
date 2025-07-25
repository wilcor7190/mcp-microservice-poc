/**
 * Enumera la identificación de mensajes usados en el microservicio para mapear la respuesta de una petición api recibida
 * @author Oscar Avila
 */

export enum EmessageMapping {
    CHANNEL_ERROR = 'CHANNEL_ERROR',
    DEFAULT_ERROR = 'DEFAULT_ERROR',
    DEFAULT ='DEFAULT',
    ERROR_TIMEOUT_LEGACY = 'ERROR_TIMEOUT_LEGACY',
}

export enum Swagger {
    GENERATE_DATALOAD = 'Operación encargada de la creación de un archivo (dataload) con la información para la tienda Ecommerce.',
    SUCCESSFUL_RESPONSE = 'Respuesta satisfactoría al consumir el servicio con dataload y categoría validos.',
    WRONG_ANSWER = 'The microservice shows an erroneous response to the request that was made.',
    SERVER_ERROR = 'The microservice has presented an internal error on the server side.',
    BAD_REQUEST = 'BAD REQUEST generado por error en el request de entrada.'
}

export enum ETaskMessageGeneral {
    GET_BY_ID = "Obteniendo mensaje por ID",
    GET_ALL = "Obteniendo todos los mensajes"
}