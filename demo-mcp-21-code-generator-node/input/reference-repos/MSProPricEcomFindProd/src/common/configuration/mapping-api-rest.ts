/**
 * Enumera los nombres de metodos usados en el microservicio
 * @author Marlyn Tatiana Quiroz
 */
export enum MethodMessage {
    GETBYID = ':Id',
    GETALL = '/',
    UPDATE = ':Id'
}

export enum MappingApiRest {
    VERSION = '/V1',
    DB='db'
}

export enum EHttpStatus {
    SUCCESS = 200,
    BUSINESS_SUCCESS = 201,
    NOT_FOUND = 404,
    ERROR = 400,
    INTERNAL_ERROR = 500,
}
