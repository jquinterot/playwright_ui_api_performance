export interface ApiEndpoint {
  name: string;
  baseUrl: string;
  timeout?: number;
}

export class ApiConfig {
  private static _instance: ApiConfig;
  private _endpoints: Map<string, ApiEndpoint>;
  private _defaultEndpoint: string;
  private _timeout: number;
  private _logRequests: boolean;
  private _logResponses: boolean;

  private constructor() {
    this._endpoints = new Map([
      [
        'jsonplaceholder',
        {
          name: 'jsonplaceholder',
          baseUrl:
            process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com',
          timeout: parseInt(process.env.API_TIMEOUT || '30000'),
        },
      ],
      [
        'catfact',
        {
          name: 'catfact',
          baseUrl: 'https://catfact.ninja',
          timeout: parseInt(process.env.CATFACT_TIMEOUT || '30000'),
        },
      ],
      [
        'httpbin',
        {
          name: 'httpbin',
          baseUrl: 'https://httpbin.org',
          timeout: parseInt(process.env.HTTPBIN_TIMEOUT || '30000'),
        },
      ],
    ]);
    this._defaultEndpoint = 'jsonplaceholder';
    this._timeout = parseInt(process.env.API_TIMEOUT || '30000');
    this._logRequests = process.env.LOG_API_REQUESTS === 'true';
    this._logResponses = process.env.LOG_API_RESPONSES === 'true';
  }

  static get instance(): ApiConfig {
    if (!this._instance) {
      this._instance = new ApiConfig();
    }
    return this._instance;
  }

  get baseUrl(): string {
    return this.getEndpoint(this._defaultEndpoint).baseUrl;
  }

  getEndpoint(name: string): ApiEndpoint {
    return (
      this._endpoints.get(name) || {
        name,
        baseUrl: 'https://jsonplaceholder.typicode.com',
        timeout: this._timeout,
      }
    );
  }

  get timeout(): number {
    return this._timeout;
  }

  get logRequests(): boolean {
    return this._logRequests;
  }

  get logResponses(): boolean {
    return this._logResponses;
  }

  get headers(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }
}

export const apiConfig = ApiConfig.instance;
