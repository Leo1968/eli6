const apiEndpointInput = document.getElementById("apiEndpoint");
const apiKeyInput = document.getElementById("apiKey");
const modelNameInput = document.getElementById("modelName");
const saveBtn = document.getElementById("saveBtn");
const toast = document.getElementById("toast");

// 加载已有设置
chrome.storage.sync.get({
  apiEndpoint: "https://api.openai.com/v1/chat/completions",
  apiKey: "",
  modelName: "gpt-4o"
}, (items) => {
  apiEndpointInput.value = items.apiEndpoint;
  apiKeyInput.value = items.apiKey;
  modelNameInput.value = items.modelName;
});

// 预设点击填充
document.querySelectorAll(".preset-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    apiEndpointInput.value = btn.dataset.url;
    modelNameInput.value = btn.dataset.model;
  });
});

// 保存设置
saveBtn.addEventListener("click", () => {
  chrome.storage.sync.set({
    apiEndpoint: apiEndpointInput.value.trim(),
    apiKey: apiKeyInput.value.trim(),
    modelName: modelNameInput.value.trim()
  }, () => {
    toast.style.display = "block";
    setTimeout(() => { toast.style.display = "none"; }, 2500);
  });
});
