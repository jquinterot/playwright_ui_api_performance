/**
 * Data Factory - Local API Test Data
 *
 * Provides dynamic test data generation for Local LLM API tests.
 * Ensures unique data for parallel execution and realistic scenarios.
 */

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface CompletionRequest {
  model: string;
  messages: ChatMessage[];
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string[];
}

export interface TestScenario {
  name: string;
  request: CompletionRequest;
  expectedBehavior: string;
}

export class LocalApiDataFactory {
  private static counter = 0;

  /**
   * Generate unique ID for test isolation
   */
  private static generateId(): number {
    return Date.now() + ++this.counter;
  }

  /**
   * Create a basic completion request
   */
  static createBasicRequest(model: string, content: string): CompletionRequest {
    return {
      model,
      messages: [{ role: 'user', content }],
      max_tokens: 50,
      temperature: 0.7,
    };
  }

  /**
   * Create request with system prompt
   */
  static createWithSystemPrompt(
    model: string,
    systemContent: string,
    userContent: string,
  ): CompletionRequest {
    return {
      model,
      messages: [
        { role: 'system', content: systemContent },
        { role: 'user', content: userContent },
      ],
      max_tokens: 100,
      temperature: 0.5,
    };
  }

  /**
   * Create a conversation with context
   */
  static createConversation(
    model: string,
    turns: number = 3,
  ): CompletionRequest {
    const messages: ChatMessage[] = [
      { role: 'system', content: 'You are a helpful assistant' },
      { role: 'user', content: 'My name is TestUser' },
      {
        role: 'assistant',
        content: 'Hello TestUser! How can I help you today?',
      },
    ];

    for (let i = 0; i < turns; i++) {
      messages.push({
        role: 'user',
        content: `Question ${i + 1}`,
      });
      messages.push({
        role: 'assistant',
        content: `Answer ${i + 1}`,
      });
    }

    return {
      model,
      messages,
      max_tokens: 100,
      temperature: 0.7,
    };
  }

  /**
   * Create edge case test scenarios
   */
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

  /**
   * Create temperature test variations
   */
  static createTemperatureVariations(model: string): CompletionRequest[] {
    const prompt = 'Describe a color in one word';
    const temperatures = [0.0, 0.3, 0.5, 0.7, 1.0];

    return temperatures.map((temp) => ({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 15,
      temperature: temp,
    }));
  }

  /**
   * Create max tokens boundary tests
   */
  static createMaxTokensTests(model: string): CompletionRequest[] {
    const content = 'Write a long story about space exploration';
    const tokenLimits = [1, 5, 10, 50, 100];

    return tokenLimits.map((tokens) => ({
      model,
      messages: [{ role: 'user', content }],
      max_tokens: tokens,
      temperature: 0.7,
    }));
  }

  /**
   * Create stress test batch
   */
  static createStressTestBatch(
    model: string,
    count: number,
  ): CompletionRequest[] {
    return Array.from({ length: count }, (_, i) => ({
      model,
      messages: [
        {
          role: 'user',
          content: `Stress test request ${i + 1} at ${this.generateId()}`,
        },
      ],
      max_tokens: 20,
      temperature: 0.5,
    }));
  }

  /**
   * Create validation test data
   */
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

  /**
   * Create performance test scenarios
   */
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

  /**
   * Generate unique test identifier
   */
  static generateTestId(): string {
    return `test-${this.generateId()}`;
  }

  /**
   * Create sample prompts for testing
   */
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

// Export for easy importing
export default LocalApiDataFactory;
