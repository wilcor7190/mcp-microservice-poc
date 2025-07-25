/**
 * clase abstracta donde se define feature provider
 * * @author Jose Daniel Orellana
 */

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class IFeatureProvider {
    

    abstract saveData(general: any): Promise<any>;
    abstract deleteDataColPrtProductOffering(params: any,categoria : string);
    
}