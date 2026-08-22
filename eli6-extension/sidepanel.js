const ELI6_SYSTEM_PROMPT = `
You are the ELI6 (Visual Explain Like I'm 6) Engine.
Goal: Turn any complex topic, code, system, or concept into a single, beautiful, self-contained, visual-first HTML page.

Strict Structure & Style Guidelines:
1. Assume zero background knowledge. Keep text minimal and concise.
2. Structure:
   - Hero title: Friendly title + one-sentence summary.
   - Big analogy: Simple real-world metaphor with large visual/emoji composition.
   - How it works: 3 to 6 numbered steps with clear CSS/SVG diagrams, icons, and 1 short sentence per step.
   - Key insight: Highlighted card with the core takeaway.
   - Optional: Tiny "Deeper if you want" expandable section.
3. Design language:
   - Apple-like calm aesthetic: generous whitespace, soft neutral backgrounds (#f8fafc), soft shadows, rounded cards (border-radius: 16px/20px), restrained accent colors.
   - Fully self-contained (inline CSS, embedded SVG diagrams, no external JS/CSS frameworks).
   - Responsive across mobile and desktop.
4. Mandatory in-page download control:
   - Must include an in-page download button with the EXACT lowercase label: "download"
   - Wire the button with JavaScript to download the entire outerHTML using a Blob/ObjectURL local mechanism.
5. Footer:
   - Add a quiet footer reading "FoisonX Lab" at the bottom.

Output format:
Return ONLY pure executable HTML code. Do NOT wrap with markdown backticks (e.g. no \`\`\`html). Start directly with <!DOCTYPE html>.
`;

const renderFrame = document.getElementById("renderFrame");
const statusText = document.getElementById("statusText");
const loadingOverlay = document.getElementById("loadingOverlay");
const customInput = document.getElementById("customInput");
const btnRun = document.getElementById("btnRun");
const btnOpenPage = document.getElementById("btnOpenPage");
const btnDownload = document.getElementById("btnDownload");
let hasGeneratedContent = false;

function setContentActionsEnabled(enabled) {
  btnOpenPage.disabled = !enabled;
  btnDownload.disabled = !enabled;
}

function getCurrentHtml() {
  const frameDocument = renderFrame.contentDocument;
  if (!frameDocument?.documentElement) return null;
  return `<!DOCTYPE html>\n${frameDocument.documentElement.outerHTML}`;
}

function createContentBlobUrl() {
  const html = getCurrentHtml();
  if (!html) return null;
  return URL.createObjectURL(new Blob([html], { type: "text/html" }));
}

function downloadCurrentHtml() {
  const blobUrl = createContentBlobUrl();
  if (!blobUrl) return;

  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = "eli6-explanation.html";
  link.click();
  setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
}

function wireDownloadButtons() {
  const frameDocument = renderFrame.contentDocument;
  if (!frameDocument) return;

  frameDocument.querySelectorAll("button, a, [role='button']").forEach((button) => {
    const label = (button.textContent || button.value || "").trim().toLowerCase();
    if (label !== "download" || button.dataset.eli6DownloadBound) return;

    button.dataset.eli6DownloadBound = "true";
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();

      downloadCurrentHtml();
    }, true);
  });
}

renderFrame.addEventListener("load", () => {
  wireDownloadButtons();
  setContentActionsEnabled(hasGeneratedContent);
});

btnOpenPage.addEventListener("click", () => {
  const blobUrl = createContentBlobUrl();
  if (!blobUrl) return;
  window.open(blobUrl, "_blank");
  setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
});

btnDownload.addEventListener("click", downloadCurrentHtml);

async function generateELI6(promptText) {
  if (!promptText || !promptText.trim()) return;

  const { apiKey, apiEndpoint, modelName } = await chrome.storage.sync.get({
    apiKey: "",
    apiEndpoint: "https://api.openai.com/v1/chat/completions",
    modelName: "gpt-4o"
  });

  if (!apiKey) {
    statusText.innerHTML = `<span style="color:#ef4444;">未配置 API Key</span> · <a href="options.html" target="_blank">点击去配置</a>`;
    return;
  }

  loadingOverlay.style.display = "flex";
  btnRun.disabled = true;
  hasGeneratedContent = false;
  setContentActionsEnabled(false);
  statusText.textContent = "AI 正在绘制图解中...";

  try {
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: "system", content: ELI6_SYSTEM_PROMPT },
          { role: "user", content: `Please create an ELI6 visual HTML page for:\n\n${promptText}` }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    let htmlContent = data.choices?.[0]?.message?.content || "";

    // 清理可能的 Markdown 语法包裹
    htmlContent = htmlContent.trim();
    if (htmlContent.startsWith("```html")) htmlContent = htmlContent.slice(7);
    if (htmlContent.startsWith("```")) htmlContent = htmlContent.slice(3);
    if (htmlContent.endsWith("```")) htmlContent = htmlContent.slice(0, -3);

    hasGeneratedContent = true;
    renderFrame.srcdoc = htmlContent.trim();
    statusText.textContent = "生成完成";
  } catch (err) {
    hasGeneratedContent = false;
    setContentActionsEnabled(false);
    statusText.innerHTML = `<span style="color:#ef4444;">生成出错: ${err.message}</span>`;
  } finally {
    loadingOverlay.style.display = "none";
    btnRun.disabled = false;
  }
}

// 监听背景页右键划词消息
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "TRIGGER_GENERATE" && request.text) {
    customInput.value = request.text;
    generateELI6(request.text);
  }
});

// 面板唤起时检查未处理的划词
chrome.storage.local.get("pendingPrompt", ({ pendingPrompt }) => {
  if (pendingPrompt) {
    customInput.value = pendingPrompt;
    generateELI6(pendingPrompt);
    chrome.storage.local.remove("pendingPrompt");
  }
});

btnRun.addEventListener("click", () => {
  generateELI6(customInput.value);
});

customInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    generateELI6(customInput.value);
  }
});
