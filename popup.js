'use strict';


function googletranslate(text, language, callback) {
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "https://translation.googleapis.com/language/translate/v2?key=" + googleKey);
	xhttp.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
	xhttp.send('{"q": ["' + text + '"], "target": "' + language + '"}');
	xhttp.onload = function() {
	  callback(xhttp.response);
	}
}

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
	document.getElementById("output").textContent = selection[0];
});

// addEventListener for highlight selection changing
/*document.addEventListener('selectionchange', () => {
	document.getElementById('output').textContent = document.getSelection();
});

/*
//trying to select highlighted text and display it
chrome.tabs.executeScript( {
	code: "window.getSelection().toString();"
}, function(selection) {
	document.getElementById('output').value = selection[0];
});

//alternative selection method, not sure how to implement
/*
let el = activeWindow.document.activeElement;
if (isTextElem(el)) {
	if ('selectionStart' in el && el.selectionStart !== el.selectionEnd) {
		return el.value.substring(el.selectionStart, el.selectionEnd);
	}
}*/
