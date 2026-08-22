import { BaseAdapter } from '../core/BaseAdapter';
import { ChatRequest, ChatResponse, ErrorCode, LLMError, LLMConfig } from '../core/types';

export class ClaudeAdapter extends BaseAdapter {
  constructor(config: LLMConfig) {
    super(config);
    if (!this.config.baseURL) {
      this.config.baseURL = 'https://api.anthropic.com/v1';
    }
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    const url = `${this.config.baseURL}/messages`;
    
    const systemMessages = request.messages.filter(m => m.role === 'system');
    const system = systemMessages.map(m => m.content).join('\n');
    
    const messages = request.messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role,
        content: m.content
      }));

    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': this.config.apiKey,
      'anthropic-version': '2023-06-01'
    };

    const body = {
      model: request.model || this.config.defaultModel,
      messages,
      system: system ? system : undefined,
      max_tokens: request.max_tokens || 1024,
      temperature: request.temperature,
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
        content: data.content[0]?.text || '',
        usage: {
          prompt_tokens: data.usage?.input_tokens || 0,
          completion_tokens: data.usage?.output_tokens || 0,
          total_tokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0)
        },
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
