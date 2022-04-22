const maxTextLength = 500;
var languages;
var selLang;
getLanguages().then(result => languages = result);

function setupStyles() {
	var link = document.createElement("link");
	link.href = chrome.runtime.getURL("main.css");
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
	base.className = "inner-div";
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
		var microsoftTranslation = await microsoftTranslate(text, selLang);
		var googleTranslation = await googleTranslate(text, selLang);
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
	}
	return base;
}

async function makePopup(selection) {
	var seltext = selection.toString();
	clearPopups();
	if (selection !== "") {
		console.log(selection);
		console.log(seltext);
		var selRange = selection.getRangeAt(0).getBoundingClientRect();
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
		document.body.appendChild(base);
	}
}

var curSel = null;

document.addEventListener('mouseup', function() {
	clearPopups();
	var selection = window.getSelection();
	var seltext = selection.toString();
	if (seltext === "") {
		selection = null;
	}
	curSel = selection;
});

var hotkey; //can't set the default value here or we will have errors. see line 88
chrome.storage.onChanged.addListener(function(changes, namespace) {
	if (changes.hotkey !== undefined) {
		let raw = changes.hotkey.newValue;
		hotkey = raw;
	}
	if (changes.lang !== undefined) {
		selLang = changes.lang.newValue;
	}
	console.log("Hotkey updated in content.js to "+hotkey);
	console.log("Lang updated to " + selLang);
});
chrome.storage.local.get(['lang'], function(result) {
	selLang = result.lang;
})

document.addEventListener("keydown", function (event) {
	console.log("Keypress event occured. Set hotkey="+hotkey+" pressed key="+event.key);
	console.log("(hotkey == undefined): "+(hotkey === undefined));
	if (hotkey === undefined) {
		chrome.storage.local.get(['hotkey'], function(result) {
			hotkey = result.hotkey;
			if (event.key === hotkey && curSel != null) {
				makePopup(curSel);
			}
		});
	} else if (event.key === hotkey && curSel != null) {
		makePopup(curSel);
	}
});

setupStyles();
