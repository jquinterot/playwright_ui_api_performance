import { expect } from '@playwright/test';
import { ApiResponseStructure } from './ResponseStructureValidator';

export class TokenUsageValidator {
  static validateTokenUsage(data: ApiResponseStructure): void {
    const { prompt_tokens, completion_tokens, total_tokens } = data.usage;

    expect(prompt_tokens).toBeGreaterThanOrEqual(0);
    expect(completion_tokens).toBeGreaterThanOrEqual(0);
    expect(total_tokens).toBeGreaterThanOrEqual(0);

    expect(total_tokens).toBe(prompt_tokens + completion_tokens);
  }

  static validateMaxTokensRespected(
    data: ApiResponseStructure,
    maxTokens: number,
    tolerance = 5,
  ): void {
    expect(data.usage.completion_tokens).toBeLessThanOrEqual(
      maxTokens + tolerance,
    );

    if (data.choices[0].finish_reason === 'length') {
      expect(data.usage.completion_tokens).toBeGreaterThanOrEqual(
        maxTokens - tolerance,
      );
    }
  }
}
