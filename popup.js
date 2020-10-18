'use strict';

let output = document.getElementById('output');

//this updates right when anything in storage is changed, so limit changes to storage data
chrome.storage.onChanged.addListener(function(changes, namespace) {
	output.textContent = JSON.stringify(changes.selection.newValue);
});

//this is the code for the options page button
document.querySelector('#openOptions').addEventListener("click", function() {
	if (chrome.runtime.openOptionsPage) {
		chrome.runtime.openOptionsPage();
	} else {
		window.open(chrome.runtime.getURL('options.html'));
	}
});

chrome.tabs.executeScript( {
	code: "window.getSelection().toString();"
	}, function(selection) {
	//document.getElementById('output').textContent = selection[0];
	chrome.storage.sync.set({selection: selection[0]}, function() {
		console.log("Highlighted selection has been updated.");
	});
});
