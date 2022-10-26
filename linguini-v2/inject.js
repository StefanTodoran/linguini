let script = document.createElement('script');
script.src = chrome.runtime.getURL('fetch.js');
script.onload = function() {
  this.remove();
};
(document.head || document.documentElement).appendChild(script);
console.log("(!) Injection of fetch.js complete.");

function injectTranslationPopup() {
  console.warn("(!) Not Yet Implemeted!");
}