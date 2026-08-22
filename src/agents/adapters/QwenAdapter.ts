import { BaseOpenAIAdapter } from './BaseOpenAIAdapter';
import { LLMConfig } from '../core/types';

export class QwenAdapter extends BaseOpenAIAdapter {
  constructor(config: LLMConfig) {
    super({
      ...config,
      baseURL: config.baseURL || 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    });
  }
}
