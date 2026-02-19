/**
 * Demo Test - Verify LM Studio Connection
 *
 * This is a simple test to verify our test framework is working
 * with the local LM Studio instance at 192.168.1.19:1234
 */
import { test, expect } from '@playwright/test';

test.describe('LM Studio Connection Test', () => {
  test('Verify local API is accessible', async ({ request }) => {
    const response = await request.get('http://192.168.1.19:1234/v1/models');

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.data).toBeDefined();
    expect(data.data.length).toBeGreaterThan(0);

    // Log available models
    console.log(
      'Available models:',
      data.data.map((m: any) => m.id),
    );
  });

  test('Simple chat completion test', async ({ request }) => {
    const response = await request.post(
      'http://192.168.1.19:1234/v1/chat/completions',
      {
        data: {
          model: 'zai-org/glm-4.7-flash',
          messages: [
            {
              role: 'user',
              content:
                'Say "Hello from Playwright test!" in exactly those words',
            },
          ],
          max_tokens: 50,
          temperature: 0.1,
        },
      },
    );

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.choices).toBeDefined();
    expect(data.choices.length).toBeGreaterThan(0);

    const message = data.choices[0].message.content;
    console.log('Model response:', message);

    // Verify we got a response
    expect(message.length).toBeGreaterThan(0);
  });
});
