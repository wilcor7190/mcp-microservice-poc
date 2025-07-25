import { Injectable } from '@nestjs/common';
import { IParam } from '@claro/generic-models-library';

/**
 * clase abtracta para la construciòn de respuetas
 * @author Alexis Sterzer
 */
@Injectable()
export abstract class IParamUc {

    /**
    * operaciòn para cargar parametros
    */    
    abstract loadParams(): Promise<IParam[]>;
}