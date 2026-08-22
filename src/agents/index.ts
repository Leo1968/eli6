export * from './core/types';
export * from './core/BaseAdapter';
export * from './core/LLMFactory';
export * from './core/SkillExecutor';
export * from './utils/ConfigManager';

import { LLMFactory } from './core/LLMFactory';
import { OpenAIAdapter } from './adapters/OpenAIAdapter';
import { DoubaoAdapter } from './adapters/DoubaoAdapter';
import { KimiAdapter } from './adapters/KimiAdapter';
import { ZhipuAdapter } from './adapters/ZhipuAdapter';
import { QwenAdapter } from './adapters/QwenAdapter';
import { SparkAdapter } from './adapters/SparkAdapter';
import { ClaudeAdapter } from './adapters/ClaudeAdapter';
import { ErnieAdapter } from './adapters/ErnieAdapter';

// Register all adapters
LLMFactory.registerAdapter('openai', OpenAIAdapter);
LLMFactory.registerAdapter('doubao', DoubaoAdapter);
LLMFactory.registerAdapter('kimi', KimiAdapter);
LLMFactory.registerAdapter('zhipu', ZhipuAdapter);
LLMFactory.registerAdapter('qwen', QwenAdapter);
LLMFactory.registerAdapter('spark', SparkAdapter);
LLMFactory.registerAdapter('claude', ClaudeAdapter);
LLMFactory.registerAdapter('ernie', ErnieAdapter);
