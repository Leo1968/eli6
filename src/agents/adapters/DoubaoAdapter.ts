import { BaseOpenAIAdapter } from './BaseOpenAIAdapter';
import { LLMConfig } from '../core/types';

export class DoubaoAdapter extends BaseOpenAIAdapter {
  constructor(config: LLMConfig) {
    super({
      ...config,
      baseURL: config.baseURL || 'https://ark.cn-beijing.volces.com/api/v3',
    });
  }
}
