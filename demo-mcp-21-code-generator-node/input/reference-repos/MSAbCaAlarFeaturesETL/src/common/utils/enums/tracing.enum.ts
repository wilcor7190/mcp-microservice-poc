/**
 * Enumeraciones usadas internamente para la trazabilidad y descripción de tareas en los logs del microservicio
 * @author Santiago Martinez
 */
export enum EStatusTracingGeneral {
    FAILED = 'FAILED',
    ERROR = 'ERROR',
    SUCCESS = 'SUCCESS',
    LEGACY_SUCCESS = 'LEGACY_SUCCESS',
    LEGACY_ERROR = 'LEGACY_ERROR',
    LEGACY_WARN = 'LEGACY_WARN',
    STATUS_SUCCESS = "SUCCESS",
}

export enum ETaskTracingGeneral {
    INICIO_REQUEST = 'INICIO_REQUEST',
    FINAL_REQUEST = 'FINAL_REQUEST',
    COVERAGE = 'CONSUMO_LEGADO_MSCOVERAGE',
    MSCATALOG = 'CONSUMO_LEGADO_MSCATALOG',
    INSPIRA = 'INSPIRA',
    OPERACIONES = 'OPERACIONES'
}
