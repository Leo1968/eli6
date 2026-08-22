import { BaseOpenAIAdapter } from './BaseOpenAIAdapter';
import { LLMConfig } from '../core/types';

export class SparkAdapter extends BaseOpenAIAdapter {
  constructor(config: LLMConfig) {
    // Note: Spark API requires the password/api secret to be formatted 
    // as `<API_KEY>:<API_SECRET>` for the OpenAI compatible endpoint in some cases
    // Or just the `apiKey` if they provided the combined token.
    super({
      ...config,
      baseURL: config.baseURL || 'https://spark-api-open.xf-yun.com/v1',
    });
  }
}
