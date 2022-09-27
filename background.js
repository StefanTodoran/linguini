'use strict';

chrome.storage.local.set({hotkey: 'T'}, function() {
	console.log("Default hotkey is set to 'T'.");
});

chrome.runtime.onInstalled.addListener(function() {
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules([{
			conditions: [ new chrome.declarativeContent.PageStateMatcher({ pageUrl: {hostContains: '.'}, }) ],
			actions: [ new chrome.declarativeContent.ShowPageAction() ]
		}]);
	});
});