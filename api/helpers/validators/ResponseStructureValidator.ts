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

export class ResponseStructureValidator {
  static async validateResponseStructure(
    response: APIResponse,
  ): Promise<ApiResponseStructure> {
    expect(response.status()).toBe(200);

    const data = (await response.json()) as ApiResponseStructure;

    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('object', 'chat.completion');
    expect(data).toHaveProperty('created');
    expect(data).toHaveProperty('model');
    expect(data).toHaveProperty('choices');
    expect(data).toHaveProperty('usage');

    expect(data.choices).toBeInstanceOf(Array);
    expect(data.choices.length).toBeGreaterThan(0);

    const choice = data.choices[0];
    expect(choice).toHaveProperty('index');
    expect(choice).toHaveProperty('message');
    expect(choice).toHaveProperty('finish_reason');

    expect(choice.message).toHaveProperty('role');
    expect(choice.message).toHaveProperty('content');
    expect(typeof choice.message.content).toBe('string');

    expect(data.usage).toHaveProperty('prompt_tokens');
    expect(data.usage).toHaveProperty('completion_tokens');
    expect(data.usage).toHaveProperty('total_tokens');

    return data;
  }
}
