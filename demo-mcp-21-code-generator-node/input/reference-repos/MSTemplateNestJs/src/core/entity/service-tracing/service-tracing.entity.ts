/**
 * Clase donde se definen los campos para la trazabilidad
 * @author Fredy Santiago Martinez
 */

export interface IServiceTracing {
	status? : string, 
	origen? : string,
	task?: string,
	description?: string,

}
export interface IServiceTracingInicial {
	client?: object,
	origen : string,
	request? : object,
	channel?:string,
}