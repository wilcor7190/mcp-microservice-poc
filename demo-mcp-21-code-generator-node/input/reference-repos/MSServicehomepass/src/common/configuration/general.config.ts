/**
 * Se almacena la configuracion de los nombres de los métodos que se usan
 * @author Fredy Santiago Martinez
 */

export default {
  apiMapping: process.env.API_MAPPING || '/MSServicehomepass',
  apiVersion: process.env.API_VERSION || 'V1',
  controllerMessage: process.env.CONTROLLER_MESSAGE || '/Message',
  controllerHttpProvider: process.env.HTTP_PROVIDER || '/HttpProvider', 
  controllerMockup: process.env.CONTROLLER || '/mockup',
  controllerCoverageDetailAddress: process.env.CONTROLLER_COVERAGE_DETAILSADDRESS || '/Coverage/detailAddress',
  controllerCoverageNeighborhoodbydane: process.env.CONTROLLER_COVERAGE_NEIGHBORHOODBYDANE || '/Coverage/neighborhoodbydane',
  controllerCoverageAddressComplement: process.env.CONTROLLER_COVERAGE_ADDRESSCOMPLEMENT || '/Coverage/addresscomplement',
  controllerCoverageStructures: process.env.CONTROLLER_COVERAGE_STRUCTURES || '/Coverage/structures',
  controllerCoveragePutClientHomepass: process.env.CONTROLLER_COVERAGE_PUTCLIENTHOMEPASS || '/Coverage/putClientHomepass',
  controllerCoverageHomepass: process.env.CONTROLLER_COVERAGE_HOMEPASS || '/Coverage/homepass',
  controllerTracibility: process.env.CONTROLLER_TRACIBILITY || '/Coverage/tracibility',
  consultaDireccionExactaTabulada: process.env.APIDIRTAB || "",  
  consultaDireccion: process.env.APIDIR || "",
  consultaDireccionGeneral: process.env.APIDIRGEN || "",
  apiAddressCrearSolicitudInspira: process.env.APISOLINS || "",
  apiCapacity: process.env.CONTROLLER_API_CAPACITY || "",
  apiCreateOrder: process.env.CONTROLLER_API_CREATE_ORDER || "",
  CcmmNodeActivo: process.env.CCMM_NODE_ACTIVO || 'ACT',
  CcmmNodeInactivo: process.env.CCMM_NODE_INACTIVO || 'NAC',
  nodeActivo: process.env.NODE_ACTIVO || 'ACT',
  nodeInactivo: process.env.NODE_INACTIVO || 'NAC',
  UltimosDiasConsulta: process.env.ULTIMOS_DIAS_CONSULTA || 10,
  controllerPutCrearSolicitudInspira: process.env.CONTROLLER_CREAR_SOLICITUD_INSPIRA_ENDPOINT || "",

  //Varibles para job
  apiCMatricesAs400_buscarSolicitudPorIdSolicitud: process.env.APISOLBYID || "",
  cronPerformGetStateHomepass: process.env.CRON_PERFORM_GET_STATE_HOMEPASS || '0 8 * * MON',
  controllerJob: process.env.CONTROLLER_JOB || '/coverage/Job',
  performJob: process.env.PERFORM_JOB || 'performJob',
  controllerError: process.env.CONTROLLER_ERROR || '/Coverage/errors',
  port: process.env.PORT || 8080,
  logLevel: process.env.LOG_LEVEL || 'ALL',
  ttlCache: Number(process.env.TTL_CACHE || 0),
  consultAddressType: process.env.PARAMETER_DEFAULT_NEIGHBORHOODS || 'CK',
  logTrazabililty: process.env.LOG_TRAZABILITY === undefined ? true : (process.env.LOG_TRAZABILITY === 'true')
};

export class GlobalReqOrigin {
  static globalOrigin: any;
  static numOrden: any;
  static numSubOrder: any;
  static client: Object;
  static request: any;
  static requestHeaders: string;
}
