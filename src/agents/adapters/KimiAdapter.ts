import { BaseOpenAIAdapter } from './BaseOpenAIAdapter';
import { LLMConfig } from '../core/types';

export class KimiAdapter extends BaseOpenAIAdapter {
  constructor(config: LLMConfig) {
    super({
      ...config,
      baseURL: config.baseURL || 'https://api.moonshot.cn/v1',
    });
  }
}
