export interface IMappingFeature {
  partNumber: string,
  name: string,
  id: string,
  description: string,
  features: IFeaturesToMapping[],
  fullImage: string,
  thumbnail: string,
  URLKeyword: string
}

export interface IFeaturesToMapping {
  value: string,
  name: string,
  id: string;
}

export interface IParents {
  parentPartNumber: object,
  family: string
}