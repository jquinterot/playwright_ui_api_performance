import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApiController } from './BaseApiController';

export interface ModelInfo {
  id: string;
  object: string;
  created: number;
  owned_by: string;
}

export interface ModelsResponse {
  object: string;
  data: ModelInfo[];
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
}

export interface ChatChoice {
  index: number;
  message: {
    role: string;
    content: string;
  };
  finish_reason: string;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: ChatChoice[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class LocalApiController extends BaseApiController {
  private defaultModel = 'zai-org/glm-4.7-flash';

  constructor(request: APIRequestContext) {
    super(request, 'http://192.168.1.19:1234/v1');
  }

  async listModels(): Promise<ModelsResponse> {
    return await this.getJson<ModelsResponse>('/models');
  }

  async createChatCompletion(
    request: ChatCompletionRequest,
  ): Promise<ChatCompletionResponse> {
    return await this.postJson<ChatCompletionResponse>('/chat/completions', {
      data: request,
    });
  }

  async createChatCompletionWithStatus(
    request: ChatCompletionRequest,
  ): Promise<{ response: ChatCompletionResponse; status: number }> {
    const apiResponse = await this.post('/chat/completions', {
      data: request,
    });
    const response = (await apiResponse.json()) as ChatCompletionResponse;
    return { response, status: apiResponse.status() };
  }

  async simpleCompletion(prompt: string): Promise<string> {
    const response = await this.createChatCompletion({
      model: this.defaultModel,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 50,
    });
    return response.choices[0].message.content;
  }

  async healthCheck(): Promise<boolean> {
    try {
      const models = await this.listModels();
      return models.data.length > 0;
    } catch {
      return false;
    }
  }
}
