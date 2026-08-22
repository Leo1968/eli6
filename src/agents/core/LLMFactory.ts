import { BaseAdapter } from './BaseAdapter';
import { LLMConfig } from './types';

export class LLMFactory {
  private static registry = new Map<string, new (config: LLMConfig) => BaseAdapter>();

  /**
   * Register a new adapter class for a specific provider.
   */
  public static registerAdapter(provider: string, adapterClass: new (config: LLMConfig) => BaseAdapter) {
    this.registry.set(provider, adapterClass);
  }

  /**
   * Create an instance of an adapter based on the config.
   */
  public static createAdapter(config: LLMConfig): BaseAdapter {
    const AdapterClass = this.registry.get(config.provider);
    if (!AdapterClass) {
      throw new Error(`Unsupported LLM provider: ${config.provider}`);
    }
    return new AdapterClass(config);
  }
}
