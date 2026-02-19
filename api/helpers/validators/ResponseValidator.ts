/**
 * Response Validation Helpers
 *
 * WHY: Provides consistent response validation across all API tests.
 * Encapsulates common validation patterns and makes tests more readable.
 *
 * VALUE:
 * - Consistent validation across all tests
 * - Reusable validation methods
 * - Better error messages for failures
 */
import { APIResponse, expect } from '@playwright/test';

export class ResponseValidator {
  /**
   * Validate response status code
   */
  static async validateStatus(
    response: APIResponse,
    expectedStatus: number,
  ): Promise<void> {
    expect(response.status()).toBe(expectedStatus);
  }

  /**
   * Validate response is OK (2xx)
   */
  static async validateSuccess(response: APIResponse): Promise<void> {
    expect(response.ok()).toBe(true);
  }

  /**
   * Validate response is not found (404)
   */
  static async validateNotFound(response: APIResponse): Promise<void> {
    expect(response.status()).toBe(404);
  }

  /**
   * Validate response has expected JSON structure
   */
  static async validateJson(response: APIResponse): Promise<void> {
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/json');
  }

  /**
   * Validate response body contains key
   */
  static async validateBodyContainsKey(
    response: APIResponse,
    key: string,
  ): Promise<void> {
    const body = await response.json();
    expect(body).toHaveProperty(key);
  }

  /**
   * Validate response body matches expected object
   */
  static async validateBodyMatches(
    response: APIResponse,
    expected: Record<string, unknown>,
  ): Promise<void> {
    const body = await response.json();
    expect(body).toMatchObject(expected);
  }

  /**
   * Validate array response has expected length
   */
  static async validateArrayLength(
    response: APIResponse,
    expectedLength: number,
  ): Promise<void> {
    const body = await response.json();
    expect(body).toHaveLength(expectedLength);
  }
}
