chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "eli6_explain_selection",
    title: "用 ELI6 视觉图解选中内容",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "eli6_explain_selection" && tab.id) {
    await chrome.sidePanel.open({ tabId: tab.id });
    
    await chrome.storage.local.set({ pendingPrompt: info.selectionText });
    
    chrome.runtime.sendMessage({
      action: "TRIGGER_GENERATE",
      text: info.selectionText
    }).catch(() => {
      // 侧边栏初次打开时通过 storage 监听加载
    });
  }
});

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.id) {
    await chrome.sidePanel.open({ tabId: tab.id });
  }
});