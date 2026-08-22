import { BaseAdapter } from '../core/BaseAdapter';
import { ChatRequest, ChatResponse, ErrorCode, LLMError, LLMConfig } from '../core/types';

export class ErnieAdapter extends BaseAdapter {
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor(config: LLMConfig) {
    super(config);
    if (!this.config.baseURL) {
      this.config.baseURL = 'https://aip.baidubce.com';
    }
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiresAt) {
      return this.accessToken;
    }

    const url = `${this.config.baseURL}/oauth/2.0/token?grant_type=client_credentials&client_id=${this.config.apiKey}&client_secret=${this.config.apiSecret}`;
    
    const response = await fetch(url, { method: 'POST' });
    if (!response.ok) {
      throw new LLMError('Failed to get Ernie access token', ErrorCode.AUTH_ERROR);
    }

    const data = await response.json() as any;
    if (data.error) {
      throw new LLMError(`Ernie auth error: ${data.error_description}`, ErrorCode.AUTH_ERROR, data);
    }

    this.accessToken = data.access_token;
    this.tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;
    return this.accessToken as string;
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    const token = await this.getAccessToken();
    // Use the default completions endpoint (can be mapped based on request.model if needed)
    const endpoint = request.model.includes('ernie-4.0') 
      ? '/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions_pro'
      : '/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions';
      
    const url = `${this.config.baseURL}${endpoint}?access_token=${token}`;

    // Ernie format mapping
    const systemMessages = request.messages.filter(m => m.role === 'system');
    const system = systemMessages.map(m => m.content).join('\n');
    
    const messages = request.messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role,
        content: m.content
      }));

    const body = {
      messages,
      system: system ? system : undefined,
      temperature: request.temperature,
      stream: request.stream || false,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        this.handleError({ status: response.status, data: errorData });
      }

      const data = await response.json() as any;
      if (data.error_code) {
        this.handleError({ status: 400, data });
      }

      return {
        content: data.result || '',
        usage: {
          prompt_tokens: data.usage?.prompt_tokens || 0,
          completion_tokens: data.usage?.completion_tokens || 0,
          total_tokens: data.usage?.total_tokens || 0
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
    
    const code = error.data?.error_code;
    if (code === 110 || code === 111) {
      throw new LLMError('Authentication failed', ErrorCode.AUTH_ERROR, error);
    }
    if (code === 18) {
      throw new LLMError('Rate limit exceeded', ErrorCode.RATE_LIMIT_ERROR, error);
    }
    if (error.status >= 500) {
      throw new LLMError('Server error', ErrorCode.SERVER_ERROR, error);
    }
    
    throw new LLMError('Network or unknown error', ErrorCode.NETWORK_ERROR, error);
  }
}
