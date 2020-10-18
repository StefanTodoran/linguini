
console.log("backround script is running");

const maxTextLength = 500;

function setupStyles() {
	var link = document.createElement("link");
	link.href = chrome.runtime.getURL("pagePopup.css");
	link.type = "text/css";
	link.rel = "stylesheet";
	document.getElementsByTagName("head")[0].appendChild(link);
}

function clearPopups() {
	var elesToClear = document.getElementsByClassName("linguini-clearable");
	console.log(elesToClear);
	for (let ele of elesToClear) {
		ele.remove();
	}
}

async function makePopupInner(text) {
	if (text.length > maxTextLength) {
		var origText = document.createElement('p');
		origText.className = "linguini-text";
		origText.innerText = "The selection is to large to translate";
		return origText;
	}
	var base = document.createElement('div');
	
	
	
	var gtext = document.createElement('p');
	var ghead = document.createElement('p');
	gtext.className = "maintext";
	ghead.className = "headertext";
	
	let gresult = {text:"No se", detected:"en"}; //await googleTranslate(text, 'es');
	let mresult = {text:"Yo no se", detected:"en"};//await microsoftTranslate(text, 'es');
	
	
	
	var outText = text + "\n";
	
	if (gresult.text.trim().toLowerCase() == mresult.text.trim().toLowerCase()) {
		outText += "detected: " + gresult.detected + "\n" + mresult.text + "\n";
	} else {
		outText += "detected: " + gresult.detected + "\n"
		 + gresult.text + "\n  -or-\n" + mresult.text + "\n";
	}
	
	origText.innerText = outText;
	
	return origText;
}

async function makePopup(selection) {
	var seltext = selection.toString();
	clearPopups();
	if (selection != "") {
		console.log(selection);
		console.log(seltext);
		var selRange = selection.getRangeAt(0).getBoundingClientRect();
		var parent = selection.anchorNode.parentElement;
		
		console.log("makeing popup");
		var base = document.createElement("div");
		base.id = "linguini-popup-base";
		base.className = "linguini-clearable";
		
		style = ""
		if (selRange.right < window.innerWidth/2) {
			style += "left:" + selRange.right + "px;";
		} else {
			style += "right:" + (window.innerWidth - selRange.right) + "px;";
		}
		if (selRange.bottom < window.innerHeight/2) {
			style += "top:" + selRange.bottom + "px;";
		} else {
			style += "bottom:" + (window.innerHeight - selRange.top) + "px;";
		}
		base.style = style;
		
		var innerPopup = await makePopupInner(seltext);
		
		base.appendChild(innerPopup);
		
		parent.appendChild(base);
	}
}

var curSel = null;

document.addEventListener('mouseup', function() {
	//console.log(window.getSelection());
	clearPopups();
	var selection = window.getSelection();
	var seltext = selection.toString();
	if (seltext == "") {
		selection = null;
	}
	curSel = selection;
	// chrome.runtime.sendMessage({
	// 	action: "changed-selection",
	// 	selected: window.getSelection().toString()
	// })
});

var hotkey = 't';
chrome.storage.onChanged.addListener(function(changes, namespace) {
	let raw = changes.hotkey.newValue;
	hotkey = raw;
	console.log("Hotkey updated in content.js to "+hotkey);
});

document.addEventListener("keydown", function (event) {
	console.log("Keypress event occured. Set hotkey="+hotkey+" pressed key="+event.key);
	if (event.key == hotkey && curSel != null) {
		makePopup(curSel);
	}
});


setupStyles();
