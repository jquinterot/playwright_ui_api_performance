import { APIRequestContext, APIResponse } from '@playwright/test';
import { apiConfig, ApiEndpoint } from '../helpers/config/ApiConfig';

export abstract class BaseApiController {
  protected request: APIRequestContext;
  protected baseUrl: string;
  protected config: typeof apiConfig;
  protected endpoint: ApiEndpoint;

  constructor(request: APIRequestContext, endpoint?: string);
  constructor(request: APIRequestContext, baseUrl?: string);
  constructor(request: APIRequestContext, endpointOrBaseUrl?: string) {
    this.request = request;
    this.config = apiConfig;

    if (endpointOrBaseUrl?.startsWith('http')) {
      this.baseUrl = endpointOrBaseUrl;
      this.endpoint = { name: 'custom', baseUrl: endpointOrBaseUrl };
    } else if (endpointOrBaseUrl) {
      this.endpoint = apiConfig.getEndpoint(endpointOrBaseUrl);
      this.baseUrl = this.endpoint.baseUrl;
    } else {
      this.endpoint = apiConfig.getEndpoint('jsonplaceholder');
      this.baseUrl = this.endpoint.baseUrl;
    }
  }

  protected async get(
    endpoint: string,
    options?: Parameters<APIRequestContext['get']>[1],
  ): Promise<APIResponse> {
    const url = this.buildUrl(endpoint);
    this.logRequest('GET', url, options);
    const response = await this.request.get(url, options);
    this.logResponse('GET', url, response);
    return response;
  }

  protected async post(
    endpoint: string,
    options?: Parameters<APIRequestContext['post']>[1],
  ): Promise<APIResponse> {
    const url = this.buildUrl(endpoint);
    this.logRequest('POST', url, options);
    const response = await this.request.post(url, options);
    this.logResponse('POST', url, response);
    return response;
  }

  protected async put(
    endpoint: string,
    options?: Parameters<APIRequestContext['put']>[1],
  ): Promise<APIResponse> {
    const url = this.buildUrl(endpoint);
    this.logRequest('PUT', url, options);
    const response = await this.request.put(url, options);
    this.logResponse('PUT', url, response);
    return response;
  }

  protected async delete(
    endpoint: string,
    options?: Parameters<APIRequestContext['delete']>[1],
  ): Promise<APIResponse> {
    const url = this.buildUrl(endpoint);
    this.logRequest('DELETE', url, options);
    const response = await this.request.delete(url, options);
    this.logResponse('DELETE', url, response);
    return response;
  }

  protected async patch(
    endpoint: string,
    options?: Parameters<APIRequestContext['patch']>[1],
  ): Promise<APIResponse> {
    const url = this.buildUrl(endpoint);
    this.logRequest('PATCH', url, options);
    const response = await this.request.patch(url, options);
    this.logResponse('PATCH', url, response);
    return response;
  }

  protected async getJson<T>(
    endpoint: string,
    options?: Parameters<APIRequestContext['get']>[1],
  ): Promise<T> {
    const response = await this.get(endpoint, options);
    return response.json() as T;
  }

  protected async postJson<T>(
    endpoint: string,
    options?: Parameters<APIRequestContext['post']>[1],
  ): Promise<T> {
    const response = await this.post(endpoint, options);
    return response.json() as T;
  }

  protected async putJson<T>(
    endpoint: string,
    options?: Parameters<APIRequestContext['put']>[1],
  ): Promise<T> {
    const response = await this.put(endpoint, options);
    return response.json() as T;
  }

  protected async deleteJson<T>(
    endpoint: string,
    options?: Parameters<APIRequestContext['delete']>[1],
  ): Promise<T> {
    const response = await this.delete(endpoint, options);
    return response.json() as T;
  }

  protected async patchJson<T>(
    endpoint: string,
    options?: Parameters<APIRequestContext['patch']>[1],
  ): Promise<T> {
    const response = await this.patch(endpoint, options);
    return response.json() as T;
  }

  protected buildUrl(endpoint: string): string {
    if (endpoint.startsWith('http')) {
      return endpoint;
    }
    const base = this.baseUrl.endsWith('/')
      ? this.baseUrl.slice(0, -1)
      : this.baseUrl;
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${base}${path}`;
  }

  private logRequest(method: string, url: string, options?: any): void {
    if (this.config.logRequests) {
      console.log(`[API Request] ${method} ${url}`);
      if (options?.data) {
        console.log(
          `[API Request Body] ${JSON.stringify(options.data, null, 2)}`,
        );
      }
      if (options?.params) {
        console.log(
          `[API Request Params] ${JSON.stringify(options.params, null, 2)}`,
        );
      }
    }
  }

  private logResponse(
    method: string,
    url: string,
    response: APIResponse,
  ): void {
    if (this.config.logResponses) {
      console.log(
        `[API Response] ${method} ${url} - Status: ${response.status()}`,
      );
    }
  }
}
