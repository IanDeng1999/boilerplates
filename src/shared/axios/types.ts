import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
} from "axios";

export type AxiosClient = AxiosInstance;
export type AxiosConfig = CreateAxiosDefaults;
export type RequestConfig<Data> = AxiosRequestConfig<Data>;
export type ResponseData<Data, RequestData> = AxiosResponse<Data, RequestData>;
export type RequestInterceptorArgs = Parameters<
  AxiosInstance["interceptors"]["request"]["use"]
>;
export type ResponseInterceptorArgs = Parameters<
  AxiosInstance["interceptors"]["response"]["use"]
>;
