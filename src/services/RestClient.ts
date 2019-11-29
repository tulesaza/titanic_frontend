import axios, { AxiosResponse } from "axios";

export const BASE_URL = "http://localhost:9999";

export default class RestClient {
  private baseUrl: string;
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  cleanupBackend = (): Promise<AxiosResponse> => {
    return axios({
      method: "post",
      url: this.baseUrl + "/reset"
    });
  };

  getMetricsData = (): Promise<AxiosResponse> => {
    return axios({
      method: "get",
      url: this.baseUrl + "/view"
    });
  };

  trainModel = (): Promise<AxiosResponse> => {
    return axios({
      method: "post",
      url: this.baseUrl + "/train"
    });
  };

  sendFile = (file: File): Promise<AxiosResponse> => {
    const data = new FormData();
    data.set("filearg", file);
    return axios({
      method: "post",
      url: this.baseUrl + "/upload",
      data: data,
      headers: { "Content-Type": "multipart/form-data" }
    });
  };
}
