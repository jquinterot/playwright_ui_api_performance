/**
 * Singleton Pattern - API Test Configuration
 *
 * WHY: Provides centralized configuration for API tests, similar to UI TestConfig.
 * Allows easy switching between different API environments and provides
 * consistent settings across all API tests.
 *
 * VALUE:
 * - Single source of truth for API settings
 * - Easy to switch between different API base URLs
 * - Configurable timeouts and retry settings
 * - Consistent request/response logging settings
 */
export class ApiConfig {
  private static _instance: ApiConfig;
  private _baseUrl: string;
  private _timeout: number;
  private _logRequests: boolean;
  private _logResponses: boolean;

  private constructor() {
    this._baseUrl =
      process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com';
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
    return this._baseUrl;
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
