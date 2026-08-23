# ELI6 Chrome 扩展

一个将复杂概念或网页选中文本转换为简洁、视觉优先 HTML 图解的 Chrome 扩展。

[English README](README.md)

## 功能

- 输入概念，或使用网页选中文本生成可视化解释。
- 在 Chrome 侧边栏中查看生成结果。
- 使用兼容 OpenAI Chat Completions 格式的 API 生成自包含 HTML 页面。
- 将生成的图解下载为 `eli6-explanation.html`。
- 内置支持 OpenAI、DeepSeek、OpenRouter；其他服务商需要加入扩展的主机权限。

## 使用要求

- Google Chrome 116 或更高版本。
- 一个兼容 OpenAI 接口格式的服务商 API Key。
- 一个该服务商支持的聊天模型。

## 安装

1. 下载或克隆本仓库。
2. 在 Chrome 地址栏打开 `chrome://extensions/`。
3. 开启右上角的**开发者模式**。
4. 点击**加载已解压的扩展程序**。
5. 选择本目录下的 `eli6-extension` 文件夹。

## 配置 API

1. 打开扩展的详情页。
2. 点击**扩展程序选项**。
3. 选择服务商预设，或手动填写兼容 OpenAI 的接口地址。
4. 填写 API Key 和模型名称。
5. 点击**保存配置**。

内置预设：

| 服务商 | 接口地址 | 模型示例 |
| --- | --- | --- |
| OpenAI | `https://api.openai.com/v1/chat/completions` | `gpt-4o` |
| DeepSeek | `https://api.deepseek.com/chat/completions` | `deepseek-chat` |
| OpenRouter | `https://openrouter.ai/api/v1/chat/completions` | `anthropic/claude-3.5-sonnet` |

## 使用方法

- 点击浏览器工具栏中的扩展图标，打开侧边栏并输入概念。
- 或在网页中选中文字，右键点击**用 ELI6 视觉图解选中内容**。
- 图解生成后，点击结果页面中的小写 `download` 按钮下载 HTML 文件。

## 权限说明

- `contextMenus`：添加网页选中文本的右键菜单命令。
- `storage`：保存扩展设置和待处理的选中文本。
- `sidePanel`：打开 Chrome 侧边栏。
- 主机权限目前仅包含 `manifest.json` 中列出的内置 API 服务商。

如果使用其他 API 服务商，需要将其 HTTPS 域名加入 `manifest.json` 的 `host_permissions`，然后重新加载扩展。

## 安全提示

API Key 会保存在 Chrome 扩展同步存储中，并发送到你配置的接口地址。请勿分享 API Key，也不要从不可信来源加载此扩展。

## 许可证

项目整体许可证信息请参阅仓库根目录的许可证文件。
