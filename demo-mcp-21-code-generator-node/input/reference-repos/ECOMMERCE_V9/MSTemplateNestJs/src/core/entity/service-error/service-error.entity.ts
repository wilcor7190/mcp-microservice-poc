/**
 * Clase donde se definen los campos para el manejo de errores en el ms
 * @author Fredy Santiago Martinez
 */
export interface IServiceError {
  origen: string;
  message: string;
  stack: string;
  channel?: string;
  request?: any;
}