/**
 * Enumera la identificación de mensajes usados en el microservicio para mapear la respuesta de una petición api recibida
 * @author Fredy Santiago Martinez
 */
export enum EmessageMapping {
    CHANNEL_ERROR = 'CHANNEL_ERROR',
    DEFAULT_ERROR = 'DEFAULT_ERROR',
    DEFAULT ='DEFAULT'
}


export enum ETaskMessageGeneral {
    GET_BY_ID = "Obteniendo mensaje por ID",
    GET_ALL = "Obteniendo todos los mensajes"
}