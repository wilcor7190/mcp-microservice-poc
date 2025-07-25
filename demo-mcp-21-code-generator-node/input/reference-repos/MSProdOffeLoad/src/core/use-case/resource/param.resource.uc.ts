/**
 * Clase abstracta para la configuración de parametros generales
 * @author Santiago Martinez
 */
import { IParam } from '@claro/generic-models-library';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IParamUc {

    /**
    * Función para cargar los parametros en las variables estaticas
    */
    abstract loadParams(): Promise<IParam[]>;

}