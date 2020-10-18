
console.log("backround script is running");

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

function makePopup(selection) {
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
		
		var origText = document.createElement('p');
		origText.className = "linguini-text";
		// var newText = document.createElement('p');
		// newText.className = "linguini-text";
		
		origText.innerText = seltext + "\ntranslated";
		//newText.innerText = "translated";
		
		base.appendChild(origText);
		// base.appendChild(newText);
		
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
