const maxTextLength = 500;
var languages;
getLanguages().then(result => languages = result);

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
	var base = document.createElement('div');
	if (text.length > maxTextLength) {
		var errorText = document.createElement('p');
		errorText.innerText = "We do not recommend translating large amounts of text.";
		errorText.className = "main-text";
		base.appendChild(errorText);
		var errorLabel = document.createElement('p');
		errorLabel.innerText = text.length + "/" + maxTextLength + " characters highlighted.";
		errorLabel.className = "label-text";
		base.appendChild(errorLabel);
	} else {
		var microsoftTranslation = await microsoftTranslate(text, 'es');
		var googleTranslation = await googleTranslate(text, 'es');
		var microsoftLabel = document.createElement('p');
		microsoftLabel.innerText = "Microsoft:";
		microsoftLabel.className = "label-text";
		base.appendChild(microsoftLabel);
		var microsoftText = document.createElement('p');
		microsoftText.innerText = microsoftTranslation.text;
		microsoftText.className = "main-text";
		base.appendChild(microsoftText);
		var googleLabel = document.createElement('p');
		googleLabel.innerText = "Google:";
		googleLabel.className = "label-text";
		base.appendChild(googleLabel);
		var googleText = document.createElement('p');
		googleText.innerText = googleTranslation.text;
		googleText.className = "main-text";
		base.appendChild(googleText);
		var detectedLabel = document.createElement('p');
		detectedLabel.innerText = "Detected: " + languages[microsoftTranslation.detected].name;
		detectedLabel.className = "label-text";
		base.appendChild(detectedLabel);
		var confidenceLabel = document.createElement('p');
		confidenceLabel.innerText = "Confidence: " + microsoftTranslation.confidence;
		confidenceLabel.className = "label-text";
		base.appendChild(confidenceLabel);
	}
	return base;
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

var hotkey; //can't set the default value here or we will have errors. see line 88
chrome.storage.onChanged.addListener(function(changes, namespace) {
	let raw = changes.hotkey.newValue;
	hotkey = raw;
	console.log("Hotkey updated in content.js to "+hotkey);
});

document.addEventListener("keydown", function (event) {
	console.log("Keypress event occured. Set hotkey="+hotkey+" pressed key="+event.key);
	console.log("(hotkey == undefined): "+(hotkey == undefined));
	if (hotkey == undefined) { hotkey = 't'; console.log ("defauling to t");} //this is how we default the value
	if (event.key == hotkey && curSel != null) {
		makePopup(curSel);
	}
});


setupStyles();
