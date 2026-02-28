import { APIResponse, expect } from '@playwright/test';
import {
  ResponseStructureValidator,
  ApiResponseStructure,
} from './ResponseStructureValidator';
import { TokenUsageValidator } from './TokenUsageValidator';
import { ContentValidator, MetadataValidator } from './ContentValidator';

export { ApiResponseStructure };

export class LocalApiValidator {
  static async validateResponseStructure(
    response: APIResponse,
  ): Promise<ApiResponseStructure> {
    return ResponseStructureValidator.validateResponseStructure(response);
  }

  static validateTokenUsage(data: ApiResponseStructure): void {
    TokenUsageValidator.validateTokenUsage(data);
  }

  static validateMaxTokensRespected(
    data: ApiResponseStructure,
    maxTokens: number,
    tolerance = 5,
  ): void {
    TokenUsageValidator.validateMaxTokensRespected(data, maxTokens, tolerance);
  }

  static validateContentNotEmpty(data: ApiResponseStructure): void {
    ContentValidator.validateContentNotEmpty(data);
  }

  static validateFinishReason(
    data: ApiResponseStructure,
    allowedReasons?: string[],
  ): void {
    ContentValidator.validateFinishReason(data, allowedReasons);
  }

  static validateTimestamp(
    data: ApiResponseStructure,
    maxAgeSeconds = 60,
  ): void {
    MetadataValidator.validateTimestamp(data, maxAgeSeconds);
  }

  static validateIdFormat(data: ApiResponseStructure): void {
    MetadataValidator.validateIdFormat(data);
  }

  static validateModelName(
    data: ApiResponseStructure,
    expectedModel?: string,
  ): void {
    MetadataValidator.validateModelName(data, expectedModel);
  }

  static async validateComplete(
    response: APIResponse,
    options?: {
      maxTokens?: number;
      expectedModel?: string;
      allowedFinishReasons?: string[];
      maxAgeSeconds?: number;
    },
  ): Promise<ApiResponseStructure> {
    const data = await this.validateResponseStructure(response);

    this.validateContentNotEmpty(data);
    this.validateTokenUsage(data);
    this.validateIdFormat(data);
    this.validateTimestamp(data, options?.maxAgeSeconds);

    if (options?.maxTokens !== undefined) {
      this.validateMaxTokensRespected(data, options.maxTokens);
    }

    if (options?.expectedModel) {
      this.validateModelName(data, options.expectedModel);
    }

    if (options?.allowedFinishReasons) {
      this.validateFinishReason(data, options.allowedFinishReasons);
    }

    return data;
  }

  static async validateErrorResponse(
    response: APIResponse,
    expectedStatus: number,
  ): Promise<void> {
    expect(response.status()).toBe(expectedStatus);

    const data = await response.json();
    expect(data).toHaveProperty('error');
    expect(data.error).toHaveProperty('message');
    expect(data.error).toHaveProperty('type');
  }

  static async validateModelsList(response: APIResponse): Promise<void> {
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('object', 'list');
    expect(data).toHaveProperty('data');
    expect(data.data).toBeInstanceOf(Array);
    expect(data.data.length).toBeGreaterThan(0);

    const firstModel = data.data[0];
    expect(firstModel).toHaveProperty('id');
    expect(firstModel).toHaveProperty('object', 'model');
  }
}
