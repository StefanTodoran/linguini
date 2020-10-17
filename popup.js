'use strict';

let changeColor = document.getElementById('changeColor');

chrome.storage.sync.get('color', function(data) {
	changeColor.style.backgroundColor = data.color;
	changeColor.setAttribute('value', data.color);
});

document.querySelector('#openOptions').addEventListener("click", function() {
	if (chrome.runtime.openOptionsPage) {
		chrome.runtime.openOptionsPage();
	} else {
		window.open(chrome.runtime.getURL('options.html'));
	}
});

changeColor.onclick = function(element) {
	let color = element.target.value;

	//trying to select highlighted text and display it
	chrome.tabs.executeScript( {
		code: "window.getSelection().toString();"
	}, function(selection) {
		document.getElementById('output').value = selection[0];
	});

	//this here sets background color to something different, we don't need and will remove
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.executeScript(
			tabs[0].id,
			{code: 'document.body.style.backgroundColor = "' + color + '";'});
	});
};


//alternative selection method, not sure how to implement
/*
let el = activeWindow.document.activeElement; 	
if (isTextElem(el)) { 		
	if ('selectionStart' in el && el.selectionStart !== el.selectionEnd) { 			
		return el.value.substring(el.selectionStart, el.selectionEnd); 		
	} 	
}*/