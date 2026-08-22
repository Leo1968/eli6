import { BaseOpenAIAdapter } from './BaseOpenAIAdapter';
import { LLMConfig } from '../core/types';

export class ZhipuAdapter extends BaseOpenAIAdapter {
  constructor(config: LLMConfig) {
    super({
      ...config,
      baseURL: config.baseURL || 'https://open.bigmodel.cn/api/paas/v4',
    });
  }
}
