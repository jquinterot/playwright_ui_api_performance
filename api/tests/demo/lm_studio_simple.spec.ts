import { test, expect } from '@playwright/test';

/**
 * Simplified LM Studio Tests
 *
 * These tests verify basic LM Studio functionality without
 * overwhelming the local instance with too many requests.
 */
test.describe('LM Studio API Tests @demo', () => {
  const baseUrl = 'http://192.168.1.19:1234/v1';
  const model = 'zai-org/glm-4.7-flash';

  test('List available models', async ({ request }) => {
    const response = await request.get(`${baseUrl}/models`);

    expect(response.status()).toBe(200);
    const data = await response.json();

    expect(data.data).toBeDefined();
    expect(data.data.length).toBeGreaterThan(0);

    console.log(
      '✓ Available models:',
      data.data.map((m: any) => m.id),
    );
  });

  test('Simple chat completion', async ({ request }) => {
    const response = await request.post(`${baseUrl}/chat/completions`, {
      data: {
        model,
        messages: [
          {
            role: 'user',
            content: 'What is the capital of France? Answer in one word.',
          },
        ],
        max_tokens: 20,
        temperature: 0.1,
      },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();

    expect(data.choices).toBeDefined();
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

    // Validate OpenAI-compatible structure
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('object', 'chat.completion');
    expect(data).toHaveProperty('created');
    expect(data).toHaveProperty('model');
    expect(data).toHaveProperty('choices');
    expect(data.choices[0]).toHaveProperty('message');
    expect(data.choices[0].message).toHaveProperty('role');
    expect(data.choices[0].message).toHaveProperty('content');

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

    // LM Studio might accept any model name and use default
    // Just verify we get a response (either success or error)
    expect([200, 400, 404, 422]).toContain(response.status());
    console.log('✓ Invalid model response status:', response.status());
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

    expect(data).toHaveProperty('usage');
    expect(data.usage).toHaveProperty('prompt_tokens');
    expect(data.usage).toHaveProperty('completion_tokens');
    expect(data.usage).toHaveProperty('total_tokens');

    console.log('✓ Token usage:', data.usage);
  });
});
