/**
 * Local API Response Validator
 *
 * Comprehensive validation helpers for Local LLM API responses.
 * Ensures responses meet expected format and quality standards.
 */
import { APIResponse, expect } from '@playwright/test';

export interface ApiResponseStructure {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class LocalApiValidator {
  /**
   * Validate complete response structure
   */
  static async validateResponseStructure(
    response: APIResponse,
  ): Promise<ApiResponseStructure> {
    expect(response.status()).toBe(200);

    const data = (await response.json()) as ApiResponseStructure;

    // Top-level fields
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('object', 'chat.completion');
    expect(data).toHaveProperty('created');
    expect(data).toHaveProperty('model');
    expect(data).toHaveProperty('choices');
    expect(data).toHaveProperty('usage');

    // Choices array
    expect(data.choices).toBeInstanceOf(Array);
    expect(data.choices.length).toBeGreaterThan(0);

    // First choice
    const choice = data.choices[0];
    expect(choice).toHaveProperty('index');
    expect(choice).toHaveProperty('message');
    expect(choice).toHaveProperty('finish_reason');

    // Message
    expect(choice.message).toHaveProperty('role');
    expect(choice.message).toHaveProperty('content');
    expect(typeof choice.message.content).toBe('string');

    // Usage
    expect(data.usage).toHaveProperty('prompt_tokens');
    expect(data.usage).toHaveProperty('completion_tokens');
    expect(data.usage).toHaveProperty('total_tokens');

    return data;
  }

  /**
   * Validate token usage is correct
   */
  static validateTokenUsage(data: ApiResponseStructure): void {
    const { prompt_tokens, completion_tokens, total_tokens } = data.usage;

    expect(prompt_tokens).toBeGreaterThanOrEqual(0);
    expect(completion_tokens).toBeGreaterThanOrEqual(0);
    expect(total_tokens).toBeGreaterThanOrEqual(0);

    // Token math should be correct
    expect(total_tokens).toBe(prompt_tokens + completion_tokens);
  }

  /**
   * Validate response respects max_tokens limit
   */
  static validateMaxTokensRespected(
    data: ApiResponseStructure,
    maxTokens: number,
    tolerance = 5,
  ): void {
    expect(data.usage.completion_tokens).toBeLessThanOrEqual(
      maxTokens + tolerance,
    );

    // If finish_reason is 'length', it hit the limit
    if (data.choices[0].finish_reason === 'length') {
      expect(data.usage.completion_tokens).toBeGreaterThanOrEqual(
        maxTokens - tolerance,
      );
    }
  }

  /**
   * Validate content is not empty
   */
  static validateContentNotEmpty(data: ApiResponseStructure): void {
    const content = data.choices[0].message.content;
    expect(content).toBeDefined();
    expect(content.length).toBeGreaterThan(0);
    expect(content.trim()).not.toBe('');
  }

  /**
   * Validate finish_reason is valid
   */
  static validateFinishReason(
    data: ApiResponseStructure,
    allowedReasons?: string[],
  ): void {
    const validReasons = allowedReasons || ['stop', 'length', 'content_filter'];
    expect(validReasons).toContain(data.choices[0].finish_reason);
  }

  /**
   * Validate timestamp is recent
   */
  static validateTimestamp(
    data: ApiResponseStructure,
    maxAgeSeconds = 60,
  ): void {
    const now = Math.floor(Date.now() / 1000);
    expect(data.created).toBeGreaterThanOrEqual(now - maxAgeSeconds);
    expect(data.created).toBeLessThanOrEqual(now + 5);
  }

  /**
   * Validate ID format
   */
  static validateIdFormat(data: ApiResponseStructure): void {
    expect(data.id).toBeTruthy();
    expect(typeof data.id).toBe('string');
    expect(data.id.length).toBeGreaterThan(0);
  }

  /**
   * Validate model name in response
   */
  static validateModelName(
    data: ApiResponseStructure,
    expectedModel?: string,
  ): void {
    expect(data.model).toBeTruthy();
    if (expectedModel) {
      expect(data.model).toBe(expectedModel);
    }
  }

  /**
   * Validate complete response with all checks
   */
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

  /**
   * Validate error response
   */
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

  /**
   * Validate models list response
   */
  static async validateModelsList(response: APIResponse): Promise<void> {
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('object', 'list');
    expect(data).toHaveProperty('data');
    expect(data.data).toBeInstanceOf(Array);
    expect(data.data.length).toBeGreaterThan(0);

    // Each model should have required fields
    const firstModel = data.data[0];
    expect(firstModel).toHaveProperty('id');
    expect(firstModel).toHaveProperty('object', 'model');
  }
}

export default LocalApiValidator;
