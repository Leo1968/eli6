import { BaseAdapter } from '../core/BaseAdapter';
import { ChatRequest, ChatResponse, ErrorCode, LLMError, LLMConfig } from '../core/types';

export class BaseOpenAIAdapter extends BaseAdapter {
  constructor(config: LLMConfig) {
    super(config);
    if (!this.config.baseURL) {
      this.config.baseURL = 'https://api.openai.com/v1';
    }
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    const url = `${this.config.baseURL}/chat/completions`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.apiKey}`,
    };

    const body = {
      model: request.model || this.config.defaultModel,
      messages: request.messages,
      temperature: request.temperature,
      max_tokens: request.max_tokens,
      stream: request.stream || false,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        this.handleError({ status: response.status, data: errorData });
      }

      const data = await response.json() as any;
      
      return {
        content: data.choices[0]?.message?.content || '',
        usage: data.usage,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  protected handleError(error: any): never {
    if (error instanceof LLMError) {
      throw error;
    }
    
    if (error.status === 401 || error.status === 403) {
      throw new LLMError('Authentication failed', ErrorCode.AUTH_ERROR, error);
    }
    if (error.status === 429) {
      throw new LLMError('Rate limit exceeded', ErrorCode.RATE_LIMIT_ERROR, error);
    }
    if (error.status >= 500) {
      throw new LLMError('Server error', ErrorCode.SERVER_ERROR, error);
    }
    
    throw new LLMError('Network or unknown error', ErrorCode.NETWORK_ERROR, error);
  }
}
