function contextClick(info, tab) {
  if (info.menuItemId === 'linguini-option') {
    console.log("Translating: ", info.selectionText);
    // do something with info.selectionText
  }
}

chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    id: 'linguini-option',
    title: 'Linguini: Translate Selection',
    contexts: ['selection'],
  });

  chrome.contextMenus.onClicked.addListener(contextClick);
});