import axios from "axios";
import type {
  AxiosClient,
  AxiosConfig,
  RequestConfig,
  RequestInterceptorArgs,
  ResponseData,
  ResponseInterceptorArgs,
} from "./types";

export class IO {
  private readonly client: AxiosClient;

  constructor(config?: AxiosConfig) {
    this.client = axios.create(config);
  }

  addRequestInterceptor(...args: RequestInterceptorArgs) {
    return this.client.interceptors.request.use(...args);
  }

  addResponseInterceptor(...args: ResponseInterceptorArgs) {
    return this.client.interceptors.response.use(...args);
  }

  request<Data = unknown, RequestData = unknown>(
    config: RequestConfig<RequestData>,
  ) {
    return this.client<Data, ResponseData<Data, RequestData>, RequestData>(
      config,
    );
  }
}
