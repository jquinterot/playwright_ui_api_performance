/**
 * Local LLM API Tests - Basic
 *
 * Tests for local LLM API at 192.168.1.19:1234
 * Uses LocalApiController for cleaner code
 */
import { test, expect } from '../../fixtures/apiFixtures';

test.describe('Local API Basic Tests @local', () => {
  const model = 'zai-org/glm-4.7-flash';

  test('API health check - List models endpoint', async ({ localapi }) => {
    const models = await localapi.listModels();

    expect(models.data).toBeDefined();
    expect(models.data).toBeInstanceOf(Array);
    expect(models.data.length).toBeGreaterThan(0);

    const firstModel = models.data[0];
    expect(firstModel).toHaveProperty('id');
    expect(firstModel).toHaveProperty('object');
  });

  test('Simple completion - Single prompt', async ({ localapi }) => {
    const content = await localapi.simpleCompletion(
      'What is 2+2? Answer with just the number.',
    );

    expect(content).toBeDefined();
    expect(content.length).toBeGreaterThan(0);
  });

  test('Response structure validation', async ({ localapi }) => {
    const response = await localapi.createChatCompletion({
      model,
      messages: [{ role: 'user', content: 'Hi' }],
      max_tokens: 10,
    });

    expect(response).toMatchObject({
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

    expect(response.choices[0]).toMatchObject({
      index: expect.any(Number),
      message: {
        role: expect.any(String),
        content: expect.any(String),
      },
      finish_reason: expect.any(String),
    });
  });

  test('Error handling - Invalid model', async ({ localapi }) => {
    const result = await localapi.createChatCompletionWithStatus({
      model: 'invalid-model-name',
      messages: [{ role: 'user', content: 'Hello' }],
      max_tokens: 10,
    });

    expect([200, 400, 404, 422]).toContain(result.status);
  });

  test('Token usage tracking', async ({ localapi }) => {
    const response = await localapi.createChatCompletion({
      model,
      messages: [{ role: 'user', content: 'Count from 1 to 5' }],
      max_tokens: 50,
    });

    expect(response.usage).toMatchObject({
      prompt_tokens: expect.any(Number),
      completion_tokens: expect.any(Number),
      total_tokens: expect.any(Number),
    });

    expect(response.usage.total_tokens).toBe(
      response.usage.prompt_tokens + response.usage.completion_tokens,
    );
  });

  test('Multi-turn conversation with context', async ({ localapi }) => {
    const response = await localapi.createChatCompletion({
      model,
      messages: [
        { role: 'user', content: 'My name is Alice' },
        { role: 'assistant', content: 'Hello Alice! Nice to meet you.' },
        { role: 'user', content: 'What is my name?' },
      ],
      max_tokens: 30,
      temperature: 0.3,
    });

    const content = response.choices[0].message.content.toLowerCase();
    expect(content).toContain('alice');
  });

  test('System prompt configuration', async ({ localapi }) => {
    const response = await localapi.createChatCompletion({
      model,
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that always responds with "Acknowledged" followed by the answer.',
        },
        { role: 'user', content: 'Say hello' },
      ],
      max_tokens: 30,
      temperature: 0.3,
    });

    const content = response.choices[0].message.content.toLowerCase();
    expect(content.length).toBeGreaterThan(0);
  });

  test('Performance - Response time check', async ({ localapi }) => {
    const startTime = Date.now();

    const result = await localapi.createChatCompletionWithStatus({
      model,
      messages: [{ role: 'user', content: 'Quick test' }],
      max_tokens: 20,
      temperature: 0.1,
    });

    const responseTime = Date.now() - startTime;

    expect(result.status).toBe(200);
    expect(responseTime).toBeLessThan(30000);
  });
});
