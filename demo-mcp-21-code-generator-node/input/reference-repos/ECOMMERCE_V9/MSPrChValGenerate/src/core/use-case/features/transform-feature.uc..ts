/**
 * Clase para transformar los datos de origen
 * @author Jose Orellana
 */

import { Injectable } from '@nestjs/common';
@Injectable()

export abstract class ITransformFeatureUc {

    abstract transformOriginalData(categoria : string): Promise<any>;

    
}