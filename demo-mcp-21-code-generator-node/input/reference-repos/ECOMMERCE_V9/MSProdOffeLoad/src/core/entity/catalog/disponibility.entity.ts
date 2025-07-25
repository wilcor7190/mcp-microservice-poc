export interface IDisponibility {
  parentPartNumber: string;
  partNumber: IPartNumber[];
  stockDisponibility: string;
}

export interface IPartNumber {
  sku: string;
  description: string;
}