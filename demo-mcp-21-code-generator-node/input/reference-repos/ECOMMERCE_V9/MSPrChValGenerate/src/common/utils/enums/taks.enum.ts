/**
 * Enumera las tareas que se realizan en el microservicio
 * @author alexisterzer
 */


export enum Etask {
    VALIDATION_CHANNEL = 'VALIDACION CANAL',
    ERROR_DATA = 'ERROR EN LA DATA',
    CREATE = 'CREANDO_RESPONSE',
    START_PROCESS = 'INICIA EL PROCESO',
    EXEC_MANUAL = 'EJECUCION MANUAL',
    FINDONE = 'CONSULTANDO_RESPONSE',
    REMOVE = 'ELIMINANDO ARCHIVO',
    LOAD_MESSAGE = 'CARGANDO_MENSAJES',
    CREATE_SERVICE_ERROR = 'CREATE_SERVICE_ERROR',
    DOWNLOAD_FILE = 'DESCARGANDO ARCHIVO',
    TRANSFORM_FILE = 'TRANSFORMANDO ARCHIVO',
    START_CRON_ATTRIBUTES = 'INICIA EL PROCESO JOB ATTRIBUTES & PRICES',
    FINISH_PROCESS_JOBPRICES = 'FINALIZO PROCESO JOB MOBILE PRECIOS',
    FINISH_PROCESS_JOBATTRIBUTES = 'FINALIZO PROCESO JOB MOBILE ATTRIBUTES',
    ERROR_SAVEDATA_HOMEATTRIBUTESPRICES = 'ERROR EN EL GUARADDO DE DATA',  
    ERROR_SAVEDATAHOME_HOMEATTRIBUTESPRICES = 'ERROR EN EL INSERTADO DE DATA',
    ERROR_DELETE_HOMEATTRIBUTES = 'ERROR EN EL ELIMNADO DE HOME ATTRIBUTES',
    ERROR_DELETE_ATTRIBUTES = 'ERROR EN EL ELIMNADO DE ATTRIBUTES EN EQUIPOS Y TECH',
    ERROR_DELETE_HOMEPRICES = 'ERROR EN EL ELIMNADO DE HOME PRICES',
    ERROR_DATABASE_CONNECTIONHOMEATTRIBUTESPRICES = 'ERROR EN LA CONEXION CON MONGO',
    FINISH_PROCESS_JOBHOMEATTRIBUTES = 'FINALIZO PROCESO JOB HOME ATTRIBUTES',
    START_PROCESS_HOMEATTRIBUTES = 'INICIA EL PROCESO JOB HOME ATTRIBUTES',
    START_PROCESS_PRICESEQUIPOS = 'INICIA EL PROCESO DE GUARDADO DE TERMINALES Y TECNOLOGIA',
    ERROR_SFTP_HOMEATTRIBUTES = "ERROR EN EL SFTP FILES DE HOME ATTRIBUTES",
    ERROR_TRANSFORMFILE_HOMEATTRIBUTES = "ERROR EN LA TRANFORMACION DE HOME ATTRIBUTES",
    FINISH_PROCESS_INSERT_HOMEATTRIBUTES = 'FINALIZO EL PROCESO DE INSERTADO HOME ATTRIBUTES',
    ERROR_DELETE_DATABASE_HOMEATTRIBUTES = 'ERROR EN EL BORRADO DE LA BASE DE DATOS HOME ATTRIBUTES',
    FINISH_PROCESS_JOBHOMEPRICES = 'FINALIZO PROCESO JOB HOME PRECIOS',
    START_PROCESS_HOMEPRICES = 'INICIA EL PROCESO JOB HOME PRICES',
    ERROR_SFTP_HOMEPRICES = "ERROR EN EL SFTP FILES DE HOME PRICES",
    FINISH_PROCESS_INSERT_HOMEPRICES = 'FINALIZO EL PROCESO DE INSERTADO HOME PRICES',
    ERROR_DELETE_DATABASE_HOMEPRICES = 'ERROR EN EL BORRADO DE LA BASE DE DATOS HOME PRICES',
    ERROR_TRANSFORM_PRICES_EQU_TECH = 'ERROR EN LA TRANSFORMACION DE PRECIOS EN TERMINALES Y TECNOLOGIA',
    ERROR_OPTION = 'LAS OPCIONES INGRESADAS NO ESTAN CONFIGURADAS',
    ERROR_EXECUTE_REST = 'ERROR_SERVICE_OMN',
    DELETE_DATA_DISPONIBILITY = 'DELETE_DATA_DISPONIBILITY',
    ERROR_GET_DATA_DISPONIBILITY_FILE = 'ERROR_GET_DATA_DISPONIBILITY_FILE',
    BEGIN_JOB_DISPONIBILITY = 'INICIO_PROCESO_JOB_DISPONOBILITY',
    FINISH_JOB_DISPONIBILITY = 'FINALIZA_PROCESO_JOB_DISPONOBILITY',
    EMIT_KAFKA = 'EMITIENDO_EVENTO_KAFKA',
    ERROR_PROCESS_KAFKA = 'ERROR_AL_EMITIR_EL_EVENTO_KAFKA',
    FIND_CARACTERISTICAS='CONSULTANDO CARACTERISTICAS EN COLPRTTTATTRIBUTES',
    ERROR_FIND_CARACTERISTICAS='ERROR CONSULTANDO CARACTERISTICAS CON DISPONIBILIDAD',
    SAVE_CARACTERISTICAS='GUARDANDO CARACTERISTICAS TERMINALES TECNOLOGIA ',
    DELETE_COLLECTION='BORRANDO COLECCION',
    DELETE_PRECIOSHOGARES='BORRANDO PRECIOS HOGARES',
    DELETE_HOMEATRIBUTES='BORRANDO HOME ATRIBUTES',
    SAVE_HOMEPRICESATTRIBUTES='GUARDANDO HOME PRICES ATTRIBUTES',
    FINDMONGOCOLLECTIONAGGREGATE='CONSULTANDO MONGO COLLECTION AGGREGATE',
    FINDDATAMONGOCOLLECTION='CONSULTANDO MONGO COLLECTION',
    DELETEDATAHOMEATTRIBUTES='BORRANDO DATA HOME ATTRIBUTES',
    DELETEDATAHOMEPRICES='BORRANDO DATA HOME PRICES',
    ERROR_SAVE_DATAMOBILEGENERALPRICES='ERROR GUARDANDO DATA MOBILE PRICES',
    ERROR_SAVE_DATAMOBILEGENERALATTRIBUTES='ERROR GUARDANDO DATA MOBILE ATTRIBUTES',
    SAVE_DATAMOBILEGENERALPRICES='GUARDANDO DATA MOBILE PRICES',
    SAVE_DATAMOBILEGENERALATTRIBUTES='GUARDANDO DATA MOBILE ATTRIBUTES',
    DELETE_DATAMOBILEATTRIBUTES='BORRANDO DATA MOBILE ATTRIBUTES',
    DELETE_DATAMOBILEPRICES='BORRANDO DATA MOBILE PRICES',
    SAVE_DATATEMPORALCOLLECTIONMOVIL='GUARDANDO DATA TEMPORAL COLLECTION MOVIL',
    SAVE_TRANSFORMDATAMOVILFEATURE='GUARDANDO TRANSFORM DATA MOVIL FEATURE',
    SAVE_TRANSFORMDATAMOVILPRICES='GUARDANDO TRANSFORM DATA MOVIL PRICES',
    DELETE_DATAMOVILFEATURES='BORRANDO DATA MOVIL FEATURES',
    DELETE_DATAMOVILPRICES='BORRANDO DATA MOVIL PRICES',
    
    SAVE_TRANSFORMDATA='GUARDANDO TRANSFORM DATA',
    SAVE_DATA='GUARDANDO DATA',
    DELETE_DATACOLPRTPRODUCTOFFERING='BORRANDO DATA PRTPRODUCTOFFERING',
    DELETE_DATACOLPRTTTATTRIBUTES='BORRANDO DATA COLPRTTTATTRIBUTES',
    START_READ_FILE='INICIA READ FILE',
    FINISHED_READ_FILE='FINALIZA READ FILE',
    DELETE_DATA_COLPRTEXCEPTIONS='BORRANDO DATA COLPRTEXCEPTIONS',
    DELETE_DATA_COLPRTTERMS='BORRANDO DATA COLPRTTERMS',
    DELETE_DATA_COLPRTDisponibilityFile='BORRANDO DATA COLPRTDisponibilityFile',
    SAVE_DATA_COLPRTEXCEPTIONS='SAVE DATA COLPRTEXCEPTIONS',
    SAVE_DATA_COLPRTTERMS='SAVE DATA COLPRTTERMS',
    GET_ALL_TERMS_CONDITIONS='GET ALL TERMS CONDITIONS',
    SAVE_DATA_COLPRTTTATTRIBUTES='SAVE DATA COLPRTTTATTRIBUTES',
    SAVE_DATA_COLPRTDisponibilityFile='SAVE DATA COLPRTDisponibilityFile',
    DELETE_PRICESCOLLECTIONS='BORRANDO COLECCIONES PRECIOS',
    FIND_JOINPRICESFEATURES='CONSULTANDO JOINPRICESFEATURES',
    FIND_JOINPRICESPRICES='CONSULTANDO JOINPRICESPRICES',
    WRITE_FILE='ESCRIBIENDO ARCHIVO VOLCADO',
    REQUEST_HTTP = 'REQUEST_HTTP',
    EXCEPTION_MANAGER = 'EXCEPTION_MANAGER',
    GET_PARAMS = 'CONSULTANDO PARAMS',
    TRANSFORMDATA = "DESCARGA Y TRANSFORMACION DE DATA ",
    READ_JSON = "TRANSFORMACION DE LINEA DEL JSON DE FEATURES",
    CONEXION_DB_SP = "CONEXION A LA BASE DE DATOS",
    CONEXION_SFTP = "CONEXION AL SFTP",
    TRANSFORM_DATA = "TRANSFORMACION DE DATOS",
    EXCEPTION_SKU = "CRUCE EXCEPCIONES SKU",
    FIND_DATE= "BUSCANDO FECHA ARCHIVO",
    FIND_AVAILABLE_FEATURES = 'CONSULTANDO CARACTERISTICAS HABILITADAS',
    APM='CAPTURE_APM_QUERY',
}

export enum EDescriptionTracingGeneral {
    START_MANUAL_PROCESS = "INICIA PROCESO DE DISPONIBILIDAD",
    ERROR_FIND_CARACTERISTICAS = "ERROR_FIND_CARACTERISTICAS",
    ERROR_FIND_EXCEPCIONES = "ERROR_FIND_EXCEPCIONES",
}

export enum ETaskDesc {
    DOWNLOAD_FILE = "ERROR EN LA DESCARGA POR MEDIO DEL SFTP",
    GET_PARAMS = 'ERROR CONSULTANDO PARAMS',
    TRANSFORMDATA = "ERROR DESCARGA Y TRANSFORMACION DE DATA ",
    READ_JSON = "ERROR EN LA TRANSFORMACION DE LINEA DEL JSON DE FEATURES",
    FIND_CARACTERISTICAS='ERROR CONSULTANDO CARACTERISTICAS CON DISPONIBILIDAD',
    SAVE_DATA='ERROR GUARDANDO DATA',
    GET_ALL_TERMS_CONDITIONS='ERROR OBTENIENDO TODA LA DATA',
    CONEXION_DB_SP = "ERROR DE CONEXION A LA BASE DE DATOS",
    TRANSFORM_DATA = "ERROR EN LA TRANSFORMACION DE DATOS",
    WRITE_FILE='ERROR ESCRIBIENDO ARCHIVO VOLCADO',
    FIND_DATE= "ERROR BUSCANDO FECHA ARCHIVO",
    EXCEPTION_SKU = "ERROR CRUCE EXCEPCIONES SKU",
    DELETE_DATA = "ERRRO ELIMINANDO DATA",
    ERROR_GET_DATA_DISPONIBILITY_FILE = 'ERROR_GET_DATA_DISPONIBILITY_FILE',
    ERROR_EXECUTE_REST = 'ERROR_SERVICE_OMN',
    REMOVE = 'ERROR ELIMINANDO ARCHIVO',
    ERROR_FILEDATA = 'ERROR LEYENDO LA DATA DEL ARCHIVO',
    ERROR_DATA = 'ERROR EN LA DATA',
    ERROR_TRANSFORM_PRICES_EQU_TECH = 'ERROR EN LA TRANSFORMACION DE PRECIOS EN TERMINALES Y TECNOLOGIA',


}