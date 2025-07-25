/**
 * Clase para construcción logica de negocio para la Etl de disponibilidad
 * @author Daniel C Rubiano Rojas
 */
import { Injectable } from '@nestjs/common';
import { FamilyParams } from 'src/common/utils/enums/params.enum';

@Injectable()
export abstract class ICatalogUc {
    abstract deleteAttributes(): Promise<void>;
    abstract saveAttributes(content: any): Promise<void>;
    abstract getDataAttributes(categoria: FamilyParams): Promise<any>;
  
    abstract deleteExceptionSkus(): Promise<void>;
    abstract saveExceptionSkus(content: any): Promise<void>;
    abstract getDataSkuException(categoria: FamilyParams): Promise<any>;

    abstract deleteTermsConditions(): Promise<any>;
    abstract saveTermsConditions(content: any): Promise<any>;
    abstract getAllTermsConditions(): Promise<any>;
  
}
