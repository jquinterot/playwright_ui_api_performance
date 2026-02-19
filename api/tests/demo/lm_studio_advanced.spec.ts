import { test, expect } from '@playwright/test';

// Helper to add delay between requests
test.describe('LM Studio Advanced Tests @demo', () => {
  const baseUrl = 'http://192.168.1.19:1234/v1';
  const model = 'zai-org/glm-4.7-flash';

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  test('Batch processing - Multiple prompts in sequence', async ({
    request,
  }) => {
    const prompts = [
      'What is 2+2?',
      'What is the capital of France?',
      'Name a color',
    ];

    const responses: string[] = [];

    for (const prompt of prompts) {
      const response = await request.post(`${baseUrl}/chat/completions`, {
        data: {
          model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 50,
          temperature: 0.1,
        },
      });

      if (response.status() === 429) {
        console.log('Rate limited, waiting...');
        await delay(1000);
        continue;
      }

      expect(response.status()).toBe(200);
      const data = await response.json();
      responses.push(data.choices[0].message.content);

      // Add delay between requests to avoid rate limiting
      await delay(500);
    }

    console.log('Batch responses:', responses);
    expect(responses).toHaveLength(3);
    responses.forEach((r) => expect(r.length).toBeGreaterThan(0));
  });

  test('Parameter variations - Different temperatures', async ({ request }) => {
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
          max_tokens: 10,
          temperature: temp,
        },
      });

      expect(response.status()).toBe(200);
      const data = await response.json();
      responses.push(data.choices[0].message.content);
    }

    console.log(
      'Temperature variations:',
      temperatures.map((t, i) => `temp=${t}: "${responses[i]}"`),
    );
    expect(responses).toHaveLength(3);
  });

  test('Error handling - Invalid model', async ({ request }) => {
    const response = await request.post(`${baseUrl}/chat/completions`, {
      data: {
        model: 'non-existent-model-12345',
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 50,
      },
    });

    // LM Studio should return error for invalid model
    expect(response.status()).not.toBe(200);
    console.log('Invalid model error status:', response.status());
  });

  test('Token limit test - Respect max_tokens', async ({ request }) => {
    const maxTokens = 20;

    const response = await request.post(`${baseUrl}/chat/completions`, {
      data: {
        model,
        messages: [
          {
            role: 'user',
            content: 'Write a long story about a dragon',
          },
        ],
        max_tokens: maxTokens,
        temperature: 0.7,
      },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();

    // Check that response respects token limit
    // Note: This is approximate as tokens != characters
    const content = data.choices[0].message.content;
    console.log(`Response with max_tokens=${maxTokens}:`, content);
    console.log(`Character count: ${content.length}`);

    expect(content.length).toBeGreaterThan(0);
    expect(data.usage?.completion_tokens || 0).toBeLessThanOrEqual(
      maxTokens + 5,
    ); // Allow small buffer
  });

  test('System prompt test - With context', async ({ request }) => {
    const response = await request.post(`${baseUrl}/chat/completions`, {
      data: {
        model,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that only speaks in Spanish',
          },
          {
            role: 'user',
            content: 'Say hello',
          },
        ],
        max_tokens: 50,
        temperature: 0.3,
      },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    const content = data.choices[0].message.content;

    console.log('System prompt response:', content);
    expect(content.length).toBeGreaterThan(0);
  });

  test('Response format - Validate JSON structure', async ({ request }) => {
    const response = await request.post(`${baseUrl}/chat/completions`, {
      data: {
        model,
        messages: [{ role: 'user', content: 'Hi' }],
        max_tokens: 20,
      },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();

    // Validate OpenAI-compatible response structure
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('object', 'chat.completion');
    expect(data).toHaveProperty('created');
    expect(data).toHaveProperty('model');
    expect(data).toHaveProperty('choices');
    expect(data.choices).toBeInstanceOf(Array);
    expect(data.choices[0]).toHaveProperty('index');
    expect(data.choices[0]).toHaveProperty('message');
    expect(data.choices[0].message).toHaveProperty('role');
    expect(data.choices[0].message).toHaveProperty('content');
    expect(data.choices[0]).toHaveProperty('finish_reason');
    expect(data).toHaveProperty('usage');
    expect(data.usage).toHaveProperty('prompt_tokens');
    expect(data.usage).toHaveProperty('completion_tokens');
    expect(data.usage).toHaveProperty('total_tokens');

    console.log('Response structure validated ✓');
    console.log('Token usage:', data.usage);
  });

  test('Concurrent requests - Load test light', async ({ request }) => {
    const concurrentRequests = 3;
    const promises = Array(concurrentRequests)
      .fill(null)
      .map((_, i) =>
        request.post(`${baseUrl}/chat/completions`, {
          data: {
            model,
            messages: [
              {
                role: 'user',
                content: `Request number ${i + 1}`,
              },
            ],
            max_tokens: 30,
            temperature: 0.5,
          },
        }),
      );

    const responses = await Promise.all(promises);

    // At least 2 should succeed (LM Studio might rate limit concurrent requests)
    const successfulResponses = responses.filter((r) => r.status() === 200);
    console.log(
      `Successful concurrent requests: ${successfulResponses.length}/${concurrentRequests}`,
    );

    expect(successfulResponses.length).toBeGreaterThanOrEqual(2);

    // Verify successful responses have content
    const contents = await Promise.all(
      successfulResponses.map((r) =>
        r.json().then((d) => d.choices[0].message.content),
      ),
    );

    console.log('All concurrent responses received:', contents.length);
    contents.forEach((c) => expect(c.length).toBeGreaterThan(0));
  });

  test('Long context test - Multi-turn conversation', async ({ request }) => {
    const conversation = [
      { role: 'user', content: 'My name is Alice' },
      { role: 'assistant', content: 'Hello Alice! Nice to meet you.' },
      { role: 'user', content: 'What is my name?' },
    ];

    const response = await request.post(`${baseUrl}/chat/completions`, {
      data: {
        model,
        messages: conversation,
        max_tokens: 50,
        temperature: 0.3,
      },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    const content = data.choices[0].message.content.toLowerCase();

    console.log('Context retention response:', content);

    // Model should remember the name from context
    expect(content).toContain('alice');
  });

  test('Performance - Measure response time', async ({ request }) => {
    const startTime = Date.now();

    const response = await request.post(`${baseUrl}/chat/completions`, {
      data: {
        model,
        messages: [{ role: 'user', content: 'Quick response test' }],
        max_tokens: 20,
        temperature: 0.1,
      },
    });

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    expect(response.status()).toBe(200);
    console.log(`Response time: ${responseTime}ms`);

    // Should respond within reasonable time (adjust as needed)
    expect(responseTime).toBeLessThan(30000); // 30 seconds max
  });
});
