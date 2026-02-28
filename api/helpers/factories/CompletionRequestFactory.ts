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

export class CompletionRequestFactory {
  private static counter = 0;

  private static generateId(): number {
    return Date.now() + ++this.counter;
  }

  static createBasicRequest(model: string, content: string): CompletionRequest {
    return {
      model,
      messages: [{ role: 'user', content }],
      max_tokens: 50,
      temperature: 0.7,
    };
  }

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
}
