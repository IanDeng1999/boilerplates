import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type CreateAxiosDefaults,
} from "axios";

export class IO {
  private readonly client: AxiosInstance;

  constructor(config?: CreateAxiosDefaults) {
    this.client = axios.create(config);
  }

  addRequestInterceptor(
    ...args: Parameters<AxiosInstance["interceptors"]["request"]["use"]>
  ) {
    return this.client.interceptors.request.use(...args);
  }

  addResponseInterceptor(
    ...args: Parameters<AxiosInstance["interceptors"]["response"]["use"]>
  ) {
    return this.client.interceptors.response.use(...args);
  }

  request<T = unknown, D = unknown>(config: AxiosRequestConfig<D>) {
    return this.client<T, AxiosResponse<T, D>, D>(config);
  }
}
