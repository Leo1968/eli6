import { LLMFactory } from '../src/agents/core/LLMFactory';
import { LLMConfig, ChatRequest } from '../src/agents/core/types';
import '../src/agents/index'; // Import index to register adapters

// Mock global fetch
global.fetch = jest.fn();

describe('LLM Adapters Compatibility Tests', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const dummyRequest: ChatRequest = {
    messages: [{ role: 'user', content: 'Hello' }],
    model: 'test-model',
  };

  test('OpenAIAdapter should format request correctly', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'Hi there' } }],
        usage: { prompt_tokens: 10, completion_tokens: 10, total_tokens: 20 }
      }),
    });

    const config: LLMConfig = { provider: 'openai', apiKey: 'test-key', defaultModel: 'gpt-4' };
    const adapter = LLMFactory.createAdapter(config);
    const res = await adapter.chat(dummyRequest);

    expect(res.content).toBe('Hi there');
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-key'
        }
      })
    );
  });

  test('ClaudeAdapter should format request correctly', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        content: [{ text: 'Hello Claude' }],
        usage: { input_tokens: 5, output_tokens: 5 }
      }),
    });

    const config: LLMConfig = { provider: 'claude', apiKey: 'test-key', defaultModel: 'claude-3' };
    const adapter = LLMFactory.createAdapter(config);
    const res = await adapter.chat(dummyRequest);

    expect(res.content).toBe('Hello Claude');
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.anthropic.com/v1/messages',
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-api-key': 'test-key',
          'anthropic-version': '2023-06-01'
        })
      })
    );
  });

  test('ErnieAdapter should handle OAuth and chat', async () => {
    // Mock OAuth response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: 'mock-access-token', expires_in: 3600 }),
    });

    // Mock Chat response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        result: 'Hello Ernie',
        usage: { prompt_tokens: 5, completion_tokens: 5, total_tokens: 10 }
      }),
    });

    const config: LLMConfig = { provider: 'ernie', apiKey: 'client_id', apiSecret: 'client_secret', defaultModel: 'ernie-bot' };
    const adapter = LLMFactory.createAdapter(config);
    const res = await adapter.chat(dummyRequest);

    expect(res.content).toBe('Hello Ernie');
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenLastCalledWith(
      'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions?access_token=mock-access-token',
      expect.any(Object)
    );
  });

  test('Other OpenAI compatible adapters should point to correct URLs', async () => {
    const providers = [
      { provider: 'doubao', url: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions' },
      { provider: 'kimi', url: 'https://api.moonshot.cn/v1/chat/completions' },
      { provider: 'zhipu', url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions' },
      { provider: 'qwen', url: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions' },
      { provider: 'spark', url: 'https://spark-api-open.xf-yun.com/v1/chat/completions' },
    ];

    for (const p of providers) {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: 'Compatible' } }],
          usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 }
        }),
      });

      const config: LLMConfig = { provider: p.provider, apiKey: 'test', defaultModel: 'test' };
      const adapter = LLMFactory.createAdapter(config);
      const res = await adapter.chat(dummyRequest);

      expect(res.content).toBe('Compatible');
      expect(global.fetch).toHaveBeenCalledWith(p.url, expect.any(Object));
    }
  });

  test('SkillExecutor should execute properly', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'Skill result' } }]
      }),
    });

    const { SkillExecutor } = require('../src/agents/core/SkillExecutor');
    const executor = new SkillExecutor({ provider: 'openai', apiKey: 'test', defaultModel: 'gpt-4' });
    const result = await executor.execute('Do something');
    expect(result).toBe('Skill result');
  });
});
