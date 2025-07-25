export interface ICatalog {
    id?: string;
    partNumber: string;
    features: IFeatures[];
    name: string;
    description: string;
    thumbnail?: string;
    fullImage?: string
  }

  export interface IFeatures { 
    name: string;
    value: string;
    id: string;
  }

  export interface IFindParents {
    parentPartNumber: string;
    family: string;
    features: IFeatures[];
  }

  export interface IValidationsToCreateTechnologyName {
    isValidateForNombreComercial: boolean;
    isValidateForComboBundle: boolean;
    isValidateForComboBundleDos: boolean;
    isValidateForComboBundleTres: boolean;
  }
  export interface IValueForDifferentFeatureId {
    NOMBRE_COMERCIAL_TECNLG: string;
    PRODUCTO_COMBO_BUNDLE: string;
    PRDCTO_COMBO_BUNDLE_DOS_TECNLG: string;
    PRDCTO_COMBO_BUNDLE_TRES_TECNL: string;
  }