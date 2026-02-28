import { APIResponse, expect } from '@playwright/test';

export class ResponseValidator {
  static async validateStatus(
    response: APIResponse,
    expectedStatus: number,
  ): Promise<void> {
    expect(response.status()).toBe(expectedStatus);
  }

  static async validateSuccess(response: APIResponse): Promise<void> {
    expect(response.ok()).toBe(true);
  }

  static async validateNotFound(response: APIResponse): Promise<void> {
    expect(response.status()).toBe(404);
  }

  static async validateJson(response: APIResponse): Promise<void> {
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/json');
  }

  static async validateBodyContainsKey(
    response: APIResponse,
    key: string,
  ): Promise<void> {
    const body = await response.json();
    expect(body).toHaveProperty(key);
  }

  static async validateBodyMatches(
    response: APIResponse,
    expected: Record<string, unknown>,
  ): Promise<void> {
    const body = await response.json();
    expect(body).toMatchObject(expected);
  }

  static async validateArrayLength(
    response: APIResponse,
    expectedLength: number,
  ): Promise<void> {
    const body = await response.json();
    expect(body).toHaveLength(expectedLength);
  }
}
