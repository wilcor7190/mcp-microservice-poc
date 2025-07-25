/**
 * Clase que guarda la trazabilidad del microservicio
 * @author Fredy Santiago Martinez
 */
import { IServiceTracing } from "src/core/entity/service-tracing/service-tracing.entity";

export default class Traceability {

    private readonly Traceability: IServiceTracing;

    constructor(traceability: IServiceTracing) {
        this.Traceability = traceability;
    }

    /**
    * Asignación del estado de la trazabilidad
    */
    public setStatus(status: string) {
        this.Traceability.status = status;
    }

    /**
    * Asignación del origen de la trazabilidad
    */
    public setOrigen(origen: string) {
        this.Traceability.origen = origen;
    }

    /**
    * Asignación de la tarea enviado en el request
    */
    public setTask(task: string) {
        this.Traceability.task = task;
    }

    /**
    * Asignación de la descripcion enviado en el request
    */
    public setDescription(description: string) {
        this.Traceability.description = description;
    }

    /**
    * Retorna arreglo con información de trazabilidad
    */
    public getTraceability() {
        return this.Traceability;
    }

}