import { LLMFactory } from './LLMFactory';
import { LLMConfig, ChatRequest } from './types';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

export interface SkillDefinition {
  interface: {
    display_name: string;
    short_description: string;
    default_prompt: string;
  };
}

export class SkillExecutor {
  private config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = config;
  }

  /**
   * Load a skill definition from a YAML file (e.g. agents/openai.yaml)
   */
  public loadSkill(skillPath: string): SkillDefinition {
    const fileContents = fs.readFileSync(skillPath, 'utf8');
    const doc = yaml.load(fileContents) as SkillDefinition;
    return doc;
  }

  /**
   * Execute a skill given the user input and an optional system prompt.
   */
  public async execute(userInput: string, systemPrompt?: string): Promise<string> {
    const adapter = LLMFactory.createAdapter(this.config);

    const messages = [];
    if (systemPrompt) {
      messages.push({ role: 'system' as const, content: systemPrompt });
    }
    messages.push({ role: 'user' as const, content: userInput });

    const request: ChatRequest = {
      messages,
      model: this.config.defaultModel,
    };

    const response = await adapter.chat(request);
    return response.content;
  }
}
