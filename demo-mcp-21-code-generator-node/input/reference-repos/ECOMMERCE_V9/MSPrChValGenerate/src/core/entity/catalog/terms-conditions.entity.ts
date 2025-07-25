import { FamilyParams } from 'src/common/utils/enums/params.enum';
import { ICharacteristics } from '../product-offering/product-offering.entity';

export interface ITermsConditions {
  Marca: string;
  Referencia: string;
  'Rango de fecha': string;
  Unidades: string;
  'T&C': string;
}

export interface IProcessTyC {
  caracteristica: ICharacteristics;
  allTermnsConditions: ITermsConditions[];
  categoria: FamilyParams;
  characteristics: ICharacteristics[];
  element : any
}

export interface ICharacteristicsTerminales {
  caracteristica: ICharacteristics;
  featuresMapping: any;
  allTermnsConditions: ITermsConditions[];
  categoria: FamilyParams;
  characteristics: ICharacteristics[];
  element : any
}
