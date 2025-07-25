/**
 * Enumeraciones del tracing usadas internamente en la lógica de negocio del microservicio
 * @author Uriel esguerra
 */

export enum EStatusTracingGeneral { 
    FAILED = 'FAILED',
    ERROR = 'ERROR',
    STATUS_SUCCESS = "SUCCESS",
    STATUS_FAILED = "FAILED",
    LEGACY_SUCCESS = 'LEGACY_SUCCESS',
    LEGACY_ERROR = 'LEGACY_ERROR',
    LEGACY_WARN = 'LEGACY_WARN',
    BD_SUCCESS = 'BD_SUCCESS',
    BD_ERROR = 'BD_ERROR',
    BD_WARN = 'BD_WARN'
}

export enum ETaskTracingGeneral {
    DELETE_DATA_MOVIL_FEATURES = "ELIMINACION DE DATOS - MOVIL",
    DELETE_DATA_MOVIL_PRICES = "ELIMINACION DE DATOS - MOVIL",
    SAVE_DATA_MOVIL_FEATURES = "GUARDADO DE DATOS CARACTERISTICAS - MOVIL",
    SAVE_DATA_MOVIL_PRICES = "GUARDADO DE DATOS PRECIOS - MOVIL",
    EXEC_CRON_FEATURES = "EJECUCION CRON DE CARACTERISTICAS",
    EXEC_CRON_PRICES = "EJECUCION CRON DE PRECIOS",
    EXEC_CRON_MOVIL = "EJECUCION CRON DE CONSULTA DE LAS CARACTERISTICAS Y PRECIOS - MOVIL",
    EXEC_MANUAL_MOVIL = "EJECUCION MANUAL DE CONSULTA DE LAS CARACTERISTICAS Y PRECIOS - MOVIL",
    DELETE_DATA = "ELIMINACION DE DATOS",
    SAVE_DATA = "GUARDADO DE DATOS",
    FILE_DOWNLOAD = 'DESCARGANDO ARCHIVO',
    FILE_TRANSFORM = 'TRANSFORMACIÓN DE INFORMACIÓN',    
    CONSUME_OMN = 'CONSUMO OMNSERVICE',
    DOWNLOAD_DATA = "DESCARGA DE DATOS",
    SAVE_DATA_MOVIL = "GUARDADO DE DATOS",
    DELETE_DATA_MOVIL = "ELIMINACION DE DATOS",
    EXEC_CRON = "EJECUCION CRON",
    EXEC_MANUAL = "EJECUCION MANUAL",
    INICIO_REQUEST = 'INICIO_REQUEST',
    FINAL_REQUEST = 'FINAL_REQUEST',
    GET_PARAMS = 'CONSULTANDO PARAMS',
    FIND_CARACTERISTICAS=' CONSULTANDO CARACTERISTICAS CON DISPONIBILIDAD',
    FIND_PRICES=' CONSULTANDO CARACTERISTICAS CON PRECIOS',
    FIND_EXCEPCIONES=' CONSULTANDO CARACTERISTICAS CON EXCEPCIONES SKU',
    ERROR_GENERATE_DATALOAD = 'ERROR GENERANDO DATALOAD',
    ERROR_SAVE_LIST_PARENTS = 'EERROR GUARDADO LISTAS DE PADRES',
    ERROR_FIND_DATA = 'ERROR CONSULTANDO INFORMACION',
    ERROR_LOAD_PARAM = 'ERROR CARGANDO PARAMETROS',
    ERROR_GENERATE_ROWS = 'ERROR GENERANDO FILAS',
    ERROR_GENERATE_PARENTS = 'ERROR GENERADNDO PADRES',
    ERROR_KAFKA_EVENT = 'ERROR ORQUESTADO DATALOAD KAFKA',
}

export enum EDescriptionTracingGeneral {
    START_DATA_CONSULTATION_PROCESS="INICIA EL PROCESO DE CONSULTA DE LAS CARACTERISTICAS Y PRECIOS",
    START_FEATURES_LOAD_PROCESS="INICIA EL PROCESO DE CARGA DE CARACTERISTICAS",
    START_MOBILE_PROCESS="INICIA EL PROCESO DE CARGA DEL JOB DE MOVILES",
    START_HOMES_PROCESS="INICIA EL PROCESO DE CARGA DEL JOB DE HOGARES",
    START_FEATURES_TRANSFORM_PROCESS="INICIA EL PROCESO DE TRANSFORMACION DE CARACTERISTICAS",
    START_PRICES_TRANSFORM_PROCESS="INICIA EL PROCESO DE TRANSFORMACION DE PRECIOS",
    START_PRICES_LOAD_PROCESS="INICIA EL PROCESO DE CARGA DE PRECIOS",
    START_MANUAL_PROCESS = "INICIA PROCESO DE CARGA DE CARACTERISTICAS PRECIOS",
    DATA_MOVIL_FEATURES = "CARACTERISTICAS ECO_GET_ATTRIBUTES_SP",
    DATA_MOVIL_PRICES = "PRECIOS ECO_GET_PRICES_SP",
    DATA_FEATURES= "COLPRTTTATTRIBUTES",
    DATA_EXCEPTIONS= "COLPRTEXCEPTIONS",
    DATA_HOMEATTRIBUTES= "COLPRTHOMEATTRIBUTES",
    DATA_MOVATTRIBUTES= "COLPRTPREPOATTRIBUTES",
    DATA_PRICES= "COLPRTFREEEQUIPPRICES & COLPRTKITPREPAIDPRICES & COLPRTTECHNOLOGYPRICES",
    NO_FILE = "ARCHIVO NO ENCONTRADO",
    REPEATED_FILES = "9 ARCHIVOS DE PRECIOS YA PROCESADOS",
    REPEATED_FILE = "ARCHIVO YA PROCESADO",
    EQU_PRICES_COLL_COLPRTPRODUCTOFFERING = "PRECIOS - COLL_COLPRTPRODUCTOFFERING",
    TEC_PRICES_COLL_COLPRTPRODUCTOFFERING = "PRECIOS - TECNOLOGIAS - COLL_COLPRTPRODUCTOFFERING",
    PRE_PRICES_COLL_COLPRTPRODUCTOFFERING = "PRECIOS - PREPAGO - COLL_COLPRTPRODUCTOFFERING",
    POS_PRICES_COLL_COLPRTPRODUCTOFFERING = "PRECIOS - POSPAGO - COLL_COLPRTPRODUCTOFFERING",
    PRE_FEATURES_COLL_COLPRTPRODUCTOFFERING = "FEATURES - PREPAGO - COLL_COLPRTPRODUCTOFFERING",
    POS_FEATURES_COLL_COLPRTPRODUCTOFFERING = "FEATURES - POSPAGO - COLL_COLPRTPRODUCTOFFERING",
    FEATURES_COLL_COLPRTPRODUCTOFFERING = "FEATURES - COLL_COLPRTPRODUCTOFFERING",
    EQU_COLL_COLPRTPRODUCTOFFERING = 'COLL_COLPRTPRODUCTOFFERING - TERMINALES',
    TEC_COLL_COLPRTPRODUCTOFFERING = 'COLL_COLPRTPRODUCTOFFERING - TECNOLOGIA',
    SAVE_FILE = 'ARCHIVO GUARDADO',
    DELETE_DATA_MOVIL_FEATURES = "PROCESO DE ELIMINACION DE CARACTERISTICAS - MOVIL - COLL_COLPRTPRODUCTOFFERING",
    DELETE_DATA_MOVIL_PRICES = "PROCESO DE ELIMINACION DE PRECIOS - MOVIL - COLL_COLPRTPRODUCTOFFERING",
    SAVE_DATA_MOVIL_FEATURES = "PROCESO DE GUARDADO DE FEATURES - MOVIL",
    SAVE_DATA_MOVIL_PRICES = "PROCESO DE GUARDADO DE PRECIOS - MOVIL",
    WRITE_FILE = 'ARCHIVO VOLCADO GUARDADO',
    NO_WRITE_FILE= 'ARCHIVO VOLCADO NO SE GUARDO',
    START_CONSUME_OMN ='PROCESO DE CONSUMO DEL OMNSERVICE',
    FINAL_PROCESS='FINALIZO EL PROCESO',
    ERROR_FIND_CARACTERISTICAS='ERROR CONSULTANDO CARACTERISTICAS CON DISPONIBILIDAD',
    ERROR_FIND_EXCEPCIONES='ERROR CONSULTANDO CARACTERISTICAS CON SKU EXCEPCIONES',
    DELETE_COLLECTION='BORRANDO COLECCION',
    SAVE_DATA_COLECCTIONS='GUARDANDO DATA COLECCION',
    FILE_PROCESS='LEYENDO ARCHIVO DESCARGADO '

}