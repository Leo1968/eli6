# ELI6 — Visual Explain Like I'm 6

[English](#english-version) | [Chinese](#中文版)

---

## 中文版

### 📖 项目简介
ELI6 是一个将复杂概念、系统架构、技术决策和代码模块转化为**图表优先、极简文本、自包含单页 HTML** 的可视化解释工具。它遵循「给 6 岁孩子解释（Explain Like I'm 6）」的原则，假设读者具备基础理解力但零领域背景，通过高信息密度的流程图、SVG 矢量图与生活比喻，让人在 10–20 秒内直观洞悉事物运作本质。

### 🚀 核心特性
* **视觉优先**：大图表、清晰流程图与 SVG 架构图为主，剔除冗长晦涩的段落。
* **极简语言**：零行业黑话，通过生活化比喻降低认知门槛。
* **独立单页**：生成的 `.html` 文件样式内联、无外部依赖，跨平台即开即用。
* **标准化结构**：包含大标题总结、生活类比、3–7 步运作分解、核心价值与进阶拓展。

### 🛠️ 技术栈
* **Runtime**: Node.js
* **Language**: TypeScript (ES2022, CommonJS)
* **Parser**: `js-yaml`
* **Testing**: Jest + `ts-jest`

---

### 📦 安装与配置

1. **克隆仓库**
   ```bash
   git clone https://github.com/Leo1968/eli6.git
   cd eli6
   npm install
   ```

2. **构建与测试**
   ```bash
   npm run build
   npm test
   ```

---

## English Version

### 📖 Overview

ELI6 (Explain Like I'm 6) is a TypeScript toolkit for turning complex ideas, system designs, technical decisions, and code modules into simple, visual-first explanations. It is designed for readers with little or no prior knowledge of the subject.

The project also provides a unified adapter layer for calling multiple large language model providers through one consistent interface. This lets an application select a provider through configuration instead of rewriting its chat integration.

### 🚀 Features

* **Visual-first explanations** — prioritize diagrams, flowcharts, SVG illustrations, and short text.
* **Plain language** — explain technical terms with concrete, everyday analogies.
* **Self-contained output target** — support single-page HTML explanations with inline styles and no required runtime dependencies.
* **Multi-provider chat adapters** — support OpenAI-compatible providers, Claude, and Ernie through a common API.
* **Skill loading** — load skill metadata from YAML files with `js-yaml`.
* **Standardized errors** — normalize authentication, rate-limit, server, and network errors as `LLMError` values.

### 🛠️ Tech Stack

* **Runtime:** Node.js
* **Language:** TypeScript targeting ES2022/CommonJS
* **Parser:** `js-yaml`
* **Testing:** Jest with `ts-jest`

### 📦 Installation

```bash
git clone https://github.com/Leo1968/eli6.git
cd eli6
npm install
```

### 🔧 Build and Test

```bash
npm run build
npm test
```

The build output is written to `dist/`. TypeScript declaration files are generated alongside the compiled JavaScript files.

### 💬 Basic Usage

Import the public API and create an adapter from an LLM configuration:

```typescript
import { LLMFactory } from './src/agents';
import './src/agents'; // Registers the built-in adapters.

const adapter = LLMFactory.createAdapter({
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY ?? '',
  defaultModel: 'gpt-4o-mini',
});

const response = await adapter.chat({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: 'Explain APIs like I am six.' }],
});

console.log(response.content);
```

Available built-in providers include `openai`, `claude`, `ernie`, `doubao`, `kimi`, `zhipu`, `qwen`, and `spark`.

### 🧩 Skill Execution

`SkillExecutor` can run a prompt with a configured provider and load YAML skill definitions:

```typescript
import { SkillExecutor } from './src/agents';

const executor = new SkillExecutor({
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY ?? '',
  defaultModel: 'gpt-4o-mini',
});

const result = await executor.execute('Explain recursion with a simple analogy.');
console.log(result);
```

### 📁 Project Structure

```text
src/agents/
├── adapters/       Provider-specific LLM adapters
├── core/           Shared types, factory, and skill execution
└── utils/          Configuration management
tests/              Adapter compatibility tests
```

### ⚠️ Notes

* Keep API keys in environment variables or another secure secret store. Do not commit them to the repository.
* The current adapter API returns a complete `ChatResponse`; streaming responses require a separate streaming interface.
* Provider-specific model names and credentials must follow each provider's API requirements.
