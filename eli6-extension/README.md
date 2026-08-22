# ELI6 Chrome Extension

An educational Chrome extension that turns complex concepts or selected webpage text into a simple, visual-first HTML explanation.

[中文版说明](README.zh-CN.md)

## Features

- Generate visual explanations from a typed concept or selected webpage text.
- Open the result in Chrome's Side Panel.
- Ask an OpenAI-compatible chat completion API to generate a self-contained HTML page.
- Download the generated explanation as `eli6-explanation.html`.
- Works with OpenAI, DeepSeek, OpenRouter, and other compatible providers that are added to the extension's host permissions.

## Requirements

- Google Chrome 116 or newer.
- An API key from an OpenAI-compatible provider.
- A chat completion model supported by that provider.

## Installation

1. Download or clone this repository.
2. Open `chrome://extensions/` in Chrome.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select this `eli6-extension` directory.

## Configuration

1. Open the extension details page.
2. Click **Extension options**.
3. Choose a provider preset or enter an OpenAI-compatible endpoint.
4. Enter your API key and model name.
5. Click **Save configuration**.

Built-in presets:

| Provider | Endpoint | Example model |
| --- | --- | --- |
| OpenAI | `https://api.openai.com/v1/chat/completions` | `gpt-4o` |
| DeepSeek | `https://api.deepseek.com/chat/completions` | `deepseek-chat` |
| OpenRouter | `https://openrouter.ai/api/v1/chat/completions` | `anthropic/claude-3.5-sonnet` |

## Usage

- Click the extension toolbar icon to open the Side Panel and enter a concept.
- Or select text on a webpage, right-click it, and choose **用 ELI6 视觉图解选中内容**.
- After the explanation is generated, click the lowercase `download` button in the result to save the HTML file.

## Permissions

- `contextMenus`: adds the selected-text context-menu command.
- `storage`: stores extension settings and the pending selected-text prompt.
- `sidePanel`: opens the Chrome Side Panel.
- Host permissions are limited to the built-in API providers in `manifest.json`.

If you use another API host, add its HTTPS origin to `host_permissions` in `manifest.json`, then reload the unpacked extension.

## Security note

Your API key is stored in Chrome extension sync storage and is sent to the endpoint you configure. Do not share the key or load this extension from an untrusted source.

## License

See the repository license for project-wide licensing information.
