/**
 * Local LLM API Tests - Basic
 *
 * Tests for local LLM API at 192.168.1.19:1234
 * Generic tests that work with any OpenAI-compatible local API
 */
import { test, expect } from '@playwright/test';

test.describe('Local API Basic Tests @local', () => {
  const baseUrl = 'http://192.168.1.19:1234/v1';
  const model = 'zai-org/glm-4.7-flash';

  test('API health check - List models endpoint', async ({ request }) => {
    const response = await request.get(`${baseUrl}/models`);

    expect(response.status()).toBe(200);
    const data = await response.json();

    expect(data.data).toBeDefined();
    expect(data.data).toBeInstanceOf(Array);
    expect(data.data.length).toBeGreaterThan(0);

    // Validate model structure
    const firstModel = data.data[0];
    expect(firstModel).toHaveProperty('id');
    expect(firstModel).toHaveProperty('object');

    console.log('✓ Available models:', data.data.length);
  });

  test('Simple completion - Single prompt', async ({ request }) => {
    const response = await request.post(`${baseUrl}/chat/completions`, {
      data: {
        model,
        messages: [
          {
            role: 'user',
            content: 'What is 2+2? Answer with just the number.',
          },
        ],
        max_tokens: 10,
        temperature: 0.1,
      },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();

    expect(data.choices[0].message.content).toBeDefined();
    console.log('✓ Response:', data.choices[0].message.content);
  });

  test('Response structure validation', async ({ request }) => {
    const response = await request.post(`${baseUrl}/chat/completions`, {
      data: {
        model,
        messages: [{ role: 'user', content: 'Hi' }],
        max_tokens: 10,
      },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();

    // Validate complete OpenAI-compatible structure
    expect(data).toMatchObject({
      id: expect.any(String),
      object: 'chat.completion',
      created: expect.any(Number),
      model: expect.any(String),
      choices: expect.any(Array),
      usage: {
        prompt_tokens: expect.any(Number),
        completion_tokens: expect.any(Number),
        total_tokens: expect.any(Number),
      },
    });

    expect(data.choices[0]).toMatchObject({
      index: expect.any(Number),
      message: {
        role: expect.any(String),
        content: expect.any(String),
      },
      finish_reason: expect.any(String),
    });

    console.log('✓ Response structure validated');
  });

  test('Error handling - Invalid model', async ({ request }) => {
    const response = await request.post(`${baseUrl}/chat/completions`, {
      data: {
        model: 'invalid-model-name',
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 10,
      },
    });

    // API might accept any model and use default, or return error
    expect([200, 400, 404, 422]).toContain(response.status());
    console.log('✓ Error handling status:', response.status());
  });

  test('Token usage tracking', async ({ request }) => {
    const response = await request.post(`${baseUrl}/chat/completions`, {
      data: {
        model,
        messages: [{ role: 'user', content: 'Count from 1 to 5' }],
        max_tokens: 50,
      },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();

    expect(data.usage).toMatchObject({
      prompt_tokens: expect.any(Number),
      completion_tokens: expect.any(Number),
      total_tokens: expect.any(Number),
    });

    // Validate token math
    expect(data.usage.total_tokens).toBe(
      data.usage.prompt_tokens + data.usage.completion_tokens,
    );

    console.log('✓ Token usage:', data.usage);
  });

  test('Multi-turn conversation with context', async ({ request }) => {
    const conversation = [
      { role: 'user', content: 'My name is Alice' },
      {
        role: 'assistant',
        content: 'Hello Alice! Nice to meet you.',
      },
      { role: 'user', content: 'What is my name?' },
    ];

    const response = await request.post(`${baseUrl}/chat/completions`, {
      data: {
        model,
        messages: conversation,
        max_tokens: 30,
        temperature: 0.3,
      },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    const content = data.choices[0].message.content.toLowerCase();

    // Model should remember the name from context
    expect(content).toContain('alice');
    console.log('✓ Context retention works:', content);
  });

  test('System prompt configuration', async ({ request }) => {
    const response = await request.post(`${baseUrl}/chat/completions`, {
      data: {
        model,
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that always responds with "Acknowledged" followed by the answer.',
          },
          {
            role: 'user',
            content: 'Say hello',
          },
        ],
        max_tokens: 30,
        temperature: 0.3,
      },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    const content = data.choices[0].message.content.toLowerCase();

    expect(content.length).toBeGreaterThan(0);
    console.log('✓ System prompt response:', content);
  });

  test('Performance - Response time check', async ({ request }) => {
    const startTime = Date.now();

    const response = await request.post(`${baseUrl}/chat/completions`, {
      data: {
        model,
        messages: [{ role: 'user', content: 'Quick test' }],
        max_tokens: 20,
        temperature: 0.1,
      },
    });

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    expect(response.status()).toBe(200);
    console.log(`✓ Response time: ${responseTime}ms`);

    // Should respond within reasonable time
    expect(responseTime).toBeLessThan(30000);
  });
});
