import { AxiosRequestConfig, AxiosInterceptorManager } from "axios";

export interface PersoniumAccessToken {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token_expires_in: number;
  id_token?: string;
  p_cookie_peer?: string;
  last_authenticated?: string;
  failed_count?: string;
}

export class PersoniumClient {
  private _httpAgent: unknown = null;
  private _httpsAgent: unknown = null;
  private _tokens?: PersoniumAccessToken;

  constructor(
    tokens: PersoniumAccessToken,
    httpAgent: unknown,
    httpsAgent: unknown
  ) {
    this._httpAgent = httpAgent;
    this._httpsAgent = httpsAgent;
    this._tokens = tokens;
  }

  public prepareConfig(requestConfig: AxiosRequestConfig): AxiosRequestConfig {
    if (this._tokens === undefined) {
      throw new Error("not authorized");
    }

    const commonConfig: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${this._tokens.access_token}`,
        "Content-Type": "application/xml",
        Accept: "application/xml",
      },
      responseType: "text",
      httpAgent: this._httpAgent,
      httpsAgent: this._httpsAgent,
    };

    console.log(commonConfig, requestConfig);
    const result: AxiosRequestConfig = {
      method: requestConfig.method || commonConfig.method,
      data: requestConfig.data || commonConfig.data,
      headers: Object.assign({}, commonConfig.headers, requestConfig.headers),
      responseType: requestConfig.responseType || commonConfig.responseType,
      httpAgent: requestConfig.httpAgent || commonConfig.httpAgent,
      httpsAgent: requestConfig.httpsAgent || commonConfig.httpsAgent,
    };

    return result;
  }
}
