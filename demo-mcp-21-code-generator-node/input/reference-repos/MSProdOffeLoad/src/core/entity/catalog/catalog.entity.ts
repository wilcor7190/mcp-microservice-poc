export interface ICatalog {
  id?: string;
  partNumber: string;
  parentPartNumber?: string;
  features: IFeatures[];
  name: string;
  description: string;
  thumbnail?: string;
  fullImage?: string;
  URLKeyword: string;
}

export interface IFeatures {
  name: string;
  value: string;
  id?: string;
}

export interface IParents {
  parentPartNumber: object,
  family: string
}

export interface ECategory {

  Terminales: ICatalog[],
  Tecnologia: ICatalog[],
  Pospago: ICatalog[],
  Prepago: ICatalog[],
  Hogares: ICatalog[],

}
