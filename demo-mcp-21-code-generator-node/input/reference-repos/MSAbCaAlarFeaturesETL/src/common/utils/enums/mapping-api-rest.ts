/**
 * Enumera los nombres de metodos usados en el microservicio
 * @author Marlyn Tatiana Quiroz
 */
export enum MethodMessage {
    GETBYID = ':Id',
    GETALL = '/',
    UPDATE = ':Id'
}

export enum MethodFeatures {
    MANUAL = "/manual"
}

export enum MappingApiRest {
    VERSION = '/V1',
    DB='db',
    CONTROLLER_BAL_CALCULATE = '/Validate',
    CONTROLLER_CUSTOMER_VALIDATE = '/ValidateCustomer',
    CONTROLLER_GENERATE_PIN = '/GeneratePin',
    CONTROLLER_VALIDATE_PIN = '/ValidatePin',
}

export enum EHttpStatus {
    SUCCESS = 200,
    BUSINESS_SUCCESS = 201,
    NOT_FOUND = 404,
    ERROR = 400,
    INTERNAL_ERROR = 500,
}
