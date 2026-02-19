/**
 * Singleton Pattern - Test Configuration
 *
 * WHY: Provides a single, centralized source for test configuration values
 * across the entire test suite. Eliminates duplicate config lookups and
 * ensures consistency.
 *
 * VALUE:
 * - Single source of truth for all test settings
 * - Easy to access from anywhere without passing config through multiple layers
 * - Can be extended to cache environment variables and computed values
 * - Useful for CI/CD where config might come from different sources
 */
export class TestConfig {
  private static _instance: TestConfig;
  private _baseUrl: string;
  private _isCI: boolean;
  private _viewport: { width: number; height: number };

  private constructor() {
    this._baseUrl = process.env.BASE_URL || 'https://www.demoblaze.com/';
    this._isCI = !!process.env.CI;
    this._viewport = { width: 1920, height: 1080 };
  }

  /**
   * Singleton instance getter - ensures only one instance exists
   */
  static get instance(): TestConfig {
    if (!this._instance) {
      this._instance = new TestConfig();
    }
    return this._instance;
  }

  get baseUrl(): string {
    return this._baseUrl;
  }

  get isCI(): boolean {
    return this._isCI;
  }

  get viewport() {
    return this._viewport;
  }

  get retries(): number {
    return this._isCI ? 2 : 0;
  }

  get workers(): number {
    return this._isCI ? 4 : 4;
  }

  get traceOnRetry(): boolean {
    return true;
  }

  get screenshotOnFailure(): boolean {
    return true;
  }

  get videoOnFailure(): boolean {
    return true;
  }
}

export const testConfig = TestConfig.instance;
