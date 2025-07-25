export interface IImagesAttachments {
  type: string;
  name: string;
  size: number;
  modifyTime: number;
  accessTime: number;
  rights: IRights;
  owner: number;
  group: number;
  longname: string;
}

export interface IRights {
  user: string;
  group: string;
  other: string;
}