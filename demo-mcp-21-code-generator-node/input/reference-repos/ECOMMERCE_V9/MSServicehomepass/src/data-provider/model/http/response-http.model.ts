export interface IrequestInfo {
  url?: string;
  source?: string;
  method?: string;
  headers?: any;
  params?: string;
  data?: string;
  timeout?: string;
}

export class ResponseHttp<R = any> {
  public readonly executed: boolean;
  public readonly status?: number;
  public readonly requestInfo?: IrequestInfo;
  public readonly message?: string;
  public data?: R;

  constructor(axiosResult: any) {
    this.executed = axiosResult?.response != undefined || axiosResult?.statusCode == 200;
    if (this.executed) {
      this.status = axiosResult.response?.statusCode || axiosResult?.statusCode;
      this.data = axiosResult.data;
    } else {
      this.message = axiosResult?.message;
    }
    this.requestInfo = {
      url: axiosResult?.config?.url,
      method: axiosResult?.config?.method,
      headers: axiosResult?.config?.headers,
      params: axiosResult?.config?.params,
      data: axiosResult?.config?.data,
      timeout: axiosResult?.config?.timeout,
      source: (axiosResult?.config?.url || axiosResult?.request?._options?.path)?.split('?')[0]
    };
  }
}
