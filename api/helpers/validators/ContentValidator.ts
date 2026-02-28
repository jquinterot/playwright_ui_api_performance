import { expect } from '@playwright/test';
import { ApiResponseStructure } from './ResponseStructureValidator';

export class ContentValidator {
  static validateContentNotEmpty(data: ApiResponseStructure): void {
    const content = data.choices[0].message.content;
    expect(content).toBeDefined();
    expect(content.length).toBeGreaterThan(0);
    expect(content.trim()).not.toBe('');
  }

  static validateFinishReason(
    data: ApiResponseStructure,
    allowedReasons?: string[],
  ): void {
    const validReasons = allowedReasons || ['stop', 'length', 'content_filter'];
    expect(validReasons).toContain(data.choices[0].finish_reason);
  }
}

export class MetadataValidator {
  static validateTimestamp(
    data: ApiResponseStructure,
    maxAgeSeconds = 60,
  ): void {
    const now = Math.floor(Date.now() / 1000);
    expect(data.created).toBeGreaterThanOrEqual(now - maxAgeSeconds);
    expect(data.created).toBeLessThanOrEqual(now + 5);
  }

  static validateIdFormat(data: ApiResponseStructure): void {
    expect(data.id).toBeTruthy();
    expect(typeof data.id).toBe('string');
    expect(data.id.length).toBeGreaterThan(0);
  }

  static validateModelName(
    data: ApiResponseStructure,
    expectedModel?: string,
  ): void {
    expect(data.model).toBeTruthy();
    if (expectedModel) {
      expect(data.model).toBe(expectedModel);
    }
  }
}
