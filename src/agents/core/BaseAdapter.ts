import { ChatRequest, ChatResponse, LLMConfig } from './types';

export abstract class BaseAdapter {
  protected config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = config;
  }

  /**
   * Send a chat request to the LLM provider.
   */
  abstract chat(request: ChatRequest): Promise<ChatResponse>;

  /**
   * Helper method to map HTTP errors to standard LLMError
   */
  protected abstract handleError(error: any): never;
}
