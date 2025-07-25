export interface IRequestConfigHttp {
  method: EHttpMethod;
  url: string;
  headers?: any;
  params?: any;
  data?: any;
  preambleCRLF?: boolean;
  postambleCRLF?: boolean;
}

export enum EHttpMethod {
  get = 'GET',
  delete = 'DELETE',
  post = 'POST',
  put = 'PUT',
}


