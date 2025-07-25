export interface IProductOffering {
    params: IParams;
    data: IData
}

export interface IParams {
    family: string;
    type: string;
    page: number
}

export interface IData {
    getProductOfferingResponse: IProductOfferingResponse[];
}

export interface IProductOfferingResponse {
    id: string;
    versions: IVersions1[];
    filter: string;
}

export interface IVersions1 {
    id: string;
    name: string;
    description: string;
    specificationType: string;
    characteristics: ICharacteristics[]
    specificationSubtype: string
}

export interface ICharacteristics {
    id: string;
    versions: IVersions2[];
}

export interface IVersions2 {
    value: string;
    name: string;
}
