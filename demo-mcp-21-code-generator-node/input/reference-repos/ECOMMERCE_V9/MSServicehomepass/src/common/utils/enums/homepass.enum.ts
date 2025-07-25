/**
 * Enumeraciones usadas internamente para listar mensajes sobre cobertura
 * @author William Corredor
 */

export enum EValidationHomepass {
  CON_COBERTURA = 'Existe cobertura en esta direccion.',
  CON_SERVICIO = 'En la dirección ingresada se encuentra instalado un servicio Claro.',
  DEFAULT = 'Por Defecto',
  SIN_COBERTURA = 'No existe cobertura en esta direccion.',
  SIN_COBERTURA_STRATA_MINUSONE = 'No hay cobertura debido a que strata es -1',
  VALIDACION_STRATUM = 'VALIDACION_STRATUM',
  HHPP_NO_EXISTE = 'Homepass no existe'
}

export enum Estratum {
  cod0 = '0',
  codm1 = '-1'
}
