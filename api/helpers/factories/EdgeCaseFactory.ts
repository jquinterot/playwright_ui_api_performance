export interface TestScenario {
  name: string;
  request: {
    model: string;
    messages: Array<{ role: string; content: string }>;
    max_tokens?: number;
    temperature?: number;
  };
  expectedBehavior: string;
}

export class EdgeCaseFactory {
  static createEdgeCaseScenarios(model: string): TestScenario[] {
    return [
      {
        name: 'Empty content',
        request: {
          model,
          messages: [{ role: 'user', content: '' }],
          max_tokens: 10,
        },
        expectedBehavior: 'Handle gracefully or return error',
      },
      {
        name: 'Very long content',
        request: {
          model,
          messages: [{ role: 'user', content: 'A'.repeat(2000) }],
          max_tokens: 10,
        },
        expectedBehavior: 'Process without timeout',
      },
      {
        name: 'Special characters',
        request: {
          model,
          messages: [
            {
              role: 'user',
              content: 'Test: @#$%^&*()_+-=[]{}|;\':",./<>?',
            },
          ],
          max_tokens: 10,
        },
        expectedBehavior: 'Handle special chars correctly',
      },
      {
        name: 'Unicode content',
        request: {
          model,
          messages: [
            {
              role: 'user',
              content: 'Hello 你好 नमस्ते مرحبا 🌍',
            },
          ],
          max_tokens: 20,
        },
        expectedBehavior: 'Support multilingual input',
      },
      {
        name: 'Code snippet',
        request: {
          model,
          messages: [
            {
              role: 'user',
              content:
                '```python\ndef hello():\n    return "world"\n```\nWhat does this do?',
            },
          ],
          max_tokens: 50,
        },
        expectedBehavior: 'Process code blocks',
      },
    ];
  }

  static createTemperatureVariations(model: string): Array<{
    model: string;
    messages: Array<{ role: string; content: string }>;
    max_tokens: number;
    temperature: number;
  }> {
    const prompt = 'Describe a color in one word';
    const temperatures = [0.0, 0.3, 0.5, 0.7, 1.0];

    return temperatures.map((temp) => ({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 15,
      temperature: temp,
    }));
  }

  static createMaxTokensTests(model: string): Array<{
    model: string;
    messages: Array<{ role: string; content: string }>;
    max_tokens: number;
    temperature: number;
  }> {
    const content = 'Write a long story about space exploration';
    const tokenLimits = [1, 5, 10, 50, 100];

    return tokenLimits.map((tokens) => ({
      model,
      messages: [{ role: 'user', content }],
      max_tokens: tokens,
      temperature: 0.7,
    }));
  }

  static createValidationTests(): Array<{
    name: string;
    data: Record<string, unknown>;
    expectedStatus: number;
  }> {
    return [
      {
        name: 'Valid request',
        data: {
          model: 'test-model',
          messages: [{ role: 'user', content: 'Hello' }],
        },
        expectedStatus: 200,
      },
      {
        name: 'Missing model',
        data: {
          messages: [{ role: 'user', content: 'Hello' }],
        },
        expectedStatus: 400,
      },
      {
        name: 'Missing messages',
        data: {
          model: 'test-model',
        },
        expectedStatus: 400,
      },
      {
        name: 'Empty messages array',
        data: {
          model: 'test-model',
          messages: [],
        },
        expectedStatus: 400,
      },
      {
        name: 'Invalid role',
        data: {
          model: 'test-model',
          messages: [{ role: 'invalid', content: 'Hello' }],
        },
        expectedStatus: 400,
      },
    ];
  }

  static createPerformanceScenarios(model: string): TestScenario[] {
    return [
      {
        name: 'Quick response',
        request: {
          model,
          messages: [{ role: 'user', content: 'Hi' }],
          max_tokens: 10,
          temperature: 0.1,
        },
        expectedBehavior: 'Response under 5 seconds',
      },
      {
        name: 'Long generation',
        request: {
          model,
          messages: [{ role: 'user', content: 'Write a poem' }],
          max_tokens: 200,
          temperature: 0.7,
        },
        expectedBehavior: 'Complete within token limit',
      },
      {
        name: 'Complex reasoning',
        request: {
          model,
          messages: [
            {
              role: 'user',
              content: 'Explain quantum computing step by step',
            },
          ],
          max_tokens: 150,
          temperature: 0.3,
        },
        expectedBehavior: 'Structured, coherent response',
      },
    ];
  }

  static generateTestId(): string {
    return `test-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

  static getSamplePrompts(): string[] {
    return [
      'What is the capital of France?',
      'Explain machine learning in simple terms',
      'Write a haiku about nature',
      'What are the benefits of exercise?',
      'Describe the color blue',
      'How do computers work?',
      'Give me a recipe for pancakes',
      'What is the meaning of life?',
      'Tell me a joke',
      'Explain blockchain technology',
    ];
  }
}
