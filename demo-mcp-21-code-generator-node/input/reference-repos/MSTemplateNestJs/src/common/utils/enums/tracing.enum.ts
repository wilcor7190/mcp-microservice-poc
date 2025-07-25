/**
 * Enumeraciones usadas internamente para la trazabilidad y descripción de tareas en los logs del microservicio
 * @author Fredy Santiago Martinez
 */

export enum EStatusTracingGeneral { 
    STATUS_SUCCESS = "SUCCESS",
    STATUS_FAILED = "FAILED"
}

export enum ETaskTracingGeneral {
    INVALID_CHANNEL = "INVALID CHANNEL",
    DOWNLOAD_DATA = "DESCARGA DE DATOS",
    SAVE_DATA_MOVIL = "GUARDADO DE DATOS",
    DELETE_DATA_MOVIL = "ELIMINACION DE DATOS",
    TASK_GENERAL="TEST",
    EXEC_CRON = "EJECUCION CRON",
    EXEC_MANUAL = "EJECUCION MANUAL",
    SAVE_DATA = "GUARDADO DE DATOS",
    DELETE_DATA = "ELIMINACION DE DATOS",
    FILE_DOWNLOAD = 'DESCARGANDO ARCHIVO'
}

