import { BaseOpenAIAdapter } from './BaseOpenAIAdapter';
import { LLMConfig } from '../core/types';

export class OpenAIAdapter extends BaseOpenAIAdapter {
  constructor(config: LLMConfig) {
    super({
      ...config,
      baseURL: config.baseURL || 'https://api.openai.com/v1',
    });
  }
}
