import { APIRequestContext, APIResponse } from '@playwright/test';

export interface MockConfig {
  urlPattern: string | RegExp;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  status?: number;
  response?: any;
  delay?: number;
  times?: number;
}

export class ApiMockService {
  private mocks: MockConfig[] = [];
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  addMock(config: MockConfig): void {
    this.mocks.push(config);
  }

  addMocks(configs: MockConfig[]): void {
    this.mocks.push(...configs);
  }

  clearMocks(): void {
    this.mocks = [];
  }

  async intercept(
    url: string,
    method: string,
    headers: Record<string, string>,
    body?: any,
  ): Promise<APIResponse | null> {
    for (const mock of this.mocks) {
      const urlMatches = this.matchesPattern(url, mock.urlPattern);
      const methodMatches = !mock.method || mock.method === method;

      if (urlMatches && methodMatches) {
        if (mock.delay) {
          await new Promise((resolve) => setTimeout(resolve, mock.delay));
        }

        const status = mock.status || 200;
        const responseBody = mock.response || {};

        return {
          ok: () => status >= 200 && status < 300,
          status: () => status,
          statusText: () => this.getStatusText(status),
          headers: () => ({ 'content-type': 'application/json' }),
          json: () => Promise.resolve(responseBody),
          text: () => Promise.resolve(JSON.stringify(responseBody)),
        } as unknown as APIResponse;
      }
    }

    return null;
  }

  private matchesPattern(url: string, pattern: string | RegExp): boolean {
    if (pattern instanceof RegExp) {
      return pattern.test(url);
    }
    return url.includes(pattern);
  }

  private getStatusText(status: number): string {
    const statusTexts: Record<number, string> = {
      200: 'OK',
      201: 'Created',
      204: 'No Content',
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      500: 'Internal Server Error',
    };
    return statusTexts[status] || 'Unknown';
  }
}

export const mockResponses = {
  jsonPlaceholder: {
    posts: Array.from({ length: 100 }, (_, i) => ({
      userId: (i % 10) + 1,
      id: i + 1,
      title: `Test Post ${i + 1}`,
      body: `This is test post body ${i + 1}`,
    })),
    post: {
      userId: 1,
      id: 1,
      title: 'Test Post',
      body: 'Test body',
    },
    users: [
      {
        id: 1,
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
      },
    ],
    comments: [
      {
        postId: 1,
        id: 1,
        name: 'Commenter',
        email: 'commenter@test.com',
        body: 'Great post!',
      },
    ],
  },
  catFact: {
    fact: 'Cats sleep for 70% of their lives.',
    length: 37,
  },
  catFacts: {
    data: [
      { fact: 'Cats sleep for 70% of their lives.', length: 37 },
      { fact: 'Cats can jump up to 6 times their length.', length: 40 },
    ],
  },
};
