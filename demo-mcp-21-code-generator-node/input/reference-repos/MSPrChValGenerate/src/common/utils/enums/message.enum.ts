/**
 * Enumera la identificación de mensajes usados en el microservicio para mapear la respuesta de una petición api recibida
 * @author alexisterzer
 */


export enum EmessageMapping {
    CHANNEL_ERROR = 'CHANNEL_ERROR',
    DEFAULT_ERROR = 'DEFAULT_ERROR',
    DEFAULT ='DEFAULT',
    ERROR_TIMEOUT_LEGACY = 'ERROR_TIMEOUT_LEGACY',
}

export enum Swagger {
    SUCCESSFUL_RESPONSE='El microservicio entrega una respuesta exitosa con la información que se espera.',
    WRONG_ANSWER='El microservicio muestra una respuesta errónea a la solicitud que se realizó.',
    INTERNAL_SERVER_ERROR = 'El microservicio ha presentado un error interno del lado del servidor.',
}
