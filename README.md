# ELI6 — Visual Explain Like I'm 6

[English](#english-version) | [中文说明](#中文版)

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
   git clone [https://github.com/your-username/eli6.git](https://github.com/your-username/eli6.git)
   cd eli6