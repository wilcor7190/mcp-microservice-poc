/**
 * Clase donde se definen los atributos para una llamada a una función remota de SAP (RFC)
 * @author David Corredor Ramírez
 */

export class SapRemoteFunction {
  functionName: string;
  simpleParams?: Record<string, any>;
  structures?: Record<string, any>;
  tables?: Record<string, any[]>;
  outputParamList?: Record<string, any>[];
  error?: string[];
  importParameterList?: Record<string, any>;
  credentials?: Record<string, string>;
  origin?: string;
}
