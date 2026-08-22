import { LLMConfig } from '../core/types';

export class ConfigManager {
  private configs: Map<string, LLMConfig> = new Map();

  public setConfig(name: string, config: LLMConfig) {
    this.configs.set(name, config);
  }

  public getConfig(name: string): LLMConfig {
    const config = this.configs.get(name);
    if (!config) {
      throw new Error(`Configuration not found for: ${name}`);
    }
    return config;
  }

  public removeConfig(name: string) {
    this.configs.delete(name);
  }
}
