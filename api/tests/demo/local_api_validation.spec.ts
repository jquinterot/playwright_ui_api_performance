/**
 * Local LLM API Tests - Data Validation & Edge Cases
 *
 * Comprehensive tests for data validation, boundary conditions,
 * and robustness testing of the local LLM API.
 */
import { test, expect } from '@playwright/test';

test.describe('Local API Data Validation @local', () => {
  const baseUrl = 'http://192.168.1.19:1234/v1';
  const model = 'zai-org/glm-4.7-flash';

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  test('Max tokens boundary - Respects limit', async ({ request }) => {
    const maxTokens = 10;

    const response = await request.post(`${baseUrl}/chat/completions`, {
      data: {
        model,
        messages: [
          {
            role: 'user',
            content: 'Write a long story about a dragon in a castle',
          },
        ],
        max_tokens: maxTokens,
        temperature: 0.7,
      },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();

    // Verify max_tokens is respected
    expect(data.usage.completion_tokens).toBeLessThanOrEqual(maxTokens + 5); // Small buffer for tokenization variance
    console.log(
      '✓ Max tokens respected:',
      data.usage.completion_tokens,
      '<=',
      maxTokens,
    );
  });

  test('Temperature variations - Different values', async ({ request }) => {
    const temperatures = [0.0, 0.5, 1.0];
    const responses: string[] = [];

    for (const temp of temperatures) {
      const response = await request.post(`${baseUrl}/chat/completions`, {
        data: {
          model,
          messages: [
            {
              role: 'user',
              content: 'Describe a sunset in one word',
            },
          ],
          max_tokens: 15,
          temperature: temp,
        },
      });

      expect(response.status()).toBe(200);
      const data = await response.json();
      responses.push(data.choices[0].message.content);

      // Small delay to avoid rate limiting
      await delay(300);
    }

    expect(responses).toHaveLength(3);
    responses.forEach((r) => expect(r.length).toBeGreaterThan(0));
    console.log('✓ Temperature variations tested:', temperatures.length);
  });

  test('Empty message handling', async ({ request }) => {
    const response = await request.post(`${baseUrl}/chat/completions`, {
      data: {
        model,
        messages: [{ role: 'user', content: '' }],
        max_tokens: 10,
      },
    });

    // API might accept or reject empty messages
    expect([200, 400]).toContain(response.status());
    console.log('✓ Empty message status:', response.status());
  });

  test('Long prompt handling', async ({ request }) => {
    const longPrompt = 'A'.repeat(1000); // 1000 character prompt

    const response = await request.post(`${baseUrl}/chat/completions`, {
      data: {
        model,
        messages: [{ role: 'user', content: longPrompt }],
        max_tokens: 20,
      },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();

    expect(data.choices[0].message.content).toBeDefined();
    expect(data.usage.prompt_tokens).toBeGreaterThan(100); // Should tokenize to many tokens
    console.log('✓ Long prompt handled, tokens:', data.usage.prompt_tokens);
  });

  test('Special characters in prompt', async ({ request }) => {
    const specialPrompts = [
      'Hello! @#$%^&*()',
      'Question: <tag> & "quotes"',
      'Emoji: 🎉🚀✨',
      'Unicode: ñ 中文 العربية',
    ];

    for (const prompt of specialPrompts) {
      const response = await request.post(`${baseUrl}/chat/completions`, {
        data: {
          model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 10,
        },
      });

      expect(response.status()).toBe(200);
      await delay(200);
    }

    console.log('✓ Special characters handled:', specialPrompts.length);
  });

  test('Multiple messages in conversation', async ({ request }) => {
    const messages = [
      { role: 'system', content: 'You are a helpful assistant' },
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there! How can I help?' },
      { role: 'user', content: 'What is the weather?' },
    ];

    const response = await request.post(`${baseUrl}/chat/completions`, {
      data: {
        model,
        messages,
        max_tokens: 30,
      },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();

    expect(data.choices[0].message.content).toBeDefined();
    console.log('✓ Multi-message conversation works');
  });

  test('Invalid JSON payload', async ({ request }) => {
    const response = await request.post(`${baseUrl}/chat/completions`, {
      data: 'invalid json here',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Should return 400 for invalid JSON
    expect([400, 422]).toContain(response.status());
    console.log('✓ Invalid JSON handled:', response.status());
  });

  test('Missing required fields', async ({ request }) => {
    const response = await request.post(`${baseUrl}/chat/completions`, {
      data: {
        // Missing 'model' and 'messages'
        max_tokens: 10,
      },
    });

    // Should return error for missing fields
    expect([400, 422]).toContain(response.status());
    console.log('✓ Missing fields handled:', response.status());
  });

  test('Finish reason validation', async ({ request }) => {
    // Test that triggers stop
    const response = await request.post(`${baseUrl}/chat/completions`, {
      data: {
        model,
        messages: [{ role: 'user', content: 'Say hello' }],
        max_tokens: 50,
      },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();

    expect(['stop', 'length']).toContain(data.choices[0].finish_reason);
    console.log('✓ Finish reason:', data.choices[0].finish_reason);
  });

  test('ID uniqueness', async ({ request }) => {
    const ids: string[] = [];

    for (let i = 0; i < 3; i++) {
      const response = await request.post(`${baseUrl}/chat/completions`, {
        data: {
          model,
          messages: [{ role: 'user', content: `Request ${i}` }],
          max_tokens: 10,
        },
      });

      expect(response.status()).toBe(200);
      const data = await response.json();
      ids.push(data.id);

      await delay(200);
    }

    // All IDs should be unique
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
    console.log('✓ Unique IDs verified:', ids.length);
  });

  test('Created timestamp is recent', async ({ request }) => {
    const beforeRequest = Math.floor(Date.now() / 1000);

    const response = await request.post(`${baseUrl}/chat/completions`, {
      data: {
        model,
        messages: [{ role: 'user', content: 'Hi' }],
        max_tokens: 10,
      },
    });

    const afterRequest = Math.floor(Date.now() / 1000);

    expect(response.status()).toBe(200);
    const data = await response.json();

    // Created timestamp should be between before and after
    expect(data.created).toBeGreaterThanOrEqual(beforeRequest - 5); // Allow 5 second buffer
    expect(data.created).toBeLessThanOrEqual(afterRequest + 5);
    console.log('✓ Timestamp valid:', data.created);
  });

  test('Concurrent request handling', async ({ request }) => {
    const promises = Array(3)
      .fill(null)
      .map((_, i) =>
        request.post(`${baseUrl}/chat/completions`, {
          data: {
            model,
            messages: [{ role: 'user', content: `Concurrent ${i}` }],
            max_tokens: 20,
          },
        }),
      );

    const responses = await Promise.all(promises);

    // At least 2 should succeed (some might be rate limited)
    const successful = responses.filter((r) => r.status() === 200);
    expect(successful.length).toBeGreaterThanOrEqual(2);

    console.log(
      '✓ Concurrent requests:',
      successful.length,
      '/',
      responses.length,
    );
  });
});
