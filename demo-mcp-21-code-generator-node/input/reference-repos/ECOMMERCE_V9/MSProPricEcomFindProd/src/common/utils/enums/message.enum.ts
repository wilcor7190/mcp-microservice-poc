/**
 * Enumera la identificación de mensajes usados en el microservicio para mapear la respuesta de una petición api recibida
 * @author Fredy Santiago Martinez
 */
export enum EmessageMapping {
    CHANNEL_ERROR = 'CHANNEL_ERROR',
    TYPE_ERROR = 'TYPE_ERROR',
    DEFAULT_ERROR = 'DEFAULT_ERROR',
    ERROR_VALIDATE_FIELDS= 'ERROR_VALIDATE_FIELDS',
    DEFAULT ='DEFAULT',
    ERROR_TIMEOUT_LEGACY = 'ERROR_TIMEOUT_LEGACY',
    SAP_ERROR = 'SAP_ERROR',
    BAD_REQUEST = 'BAD_REQUEST',
}


export enum ETaskMessageGeneral {
    GET_BY_ID = "GET_ID_MESSAGE",
    GET_ALL = "GET_ALL_MESSAGES"
}

export enum ESwagger {
    BAD_REQUEST='El microservicio ha recibido información errada en la petición',
    CREATE_ORDER_DESCRIPTION = 'Estado del pago para procesar la venta de productos y aprovisionamiento de servicios desde Tienda Virtual.',
    SERVER_ERROR='El microservicio ha presentado un error en las validaciones o consumo a servicios',
    SUCCESSFUL_RESPONSE='El microservicio entrega una respuesta exitosa con la información que se espera y crea un recurso',
}