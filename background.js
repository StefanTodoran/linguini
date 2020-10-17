'use strict';

// addEventListener for highlight selection changing
document.addEventListener('selectionchange', () => {
	document.getElementById('output').textContent = document.getSelection();
});

chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.sync.set({color: '#3aa757'}, function() {
		console.log("The color is green.");
	});
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules([{
			conditions: [new chrome.declarativeContent.PageStateMatcher({
				pageUrl: {hostContains: '.com'}, // might be jank, fix later
			})
			],
			actions: [new chrome.declarativeContent.ShowPageAction()]
		}]);
	});
});