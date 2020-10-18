
console.log("backround script is running");

function makePopupdas(parent, seltext, x, y) {
	console.log("makeing popup");
	var base = document.createElement("div");
	var origText = document.createElement('p');
	var newText = document.createElement('p');
	origText.innerText = seltext;
	newText.innerText = "translated";
	base.appendChild(origText);
	base.appendChild(newText);
	base.id = "linguini-popup-base";
	base.className = "linguini-clearable";
	base.style = "position:fixed; left:" + x + "px; top:" + y + "px;";
	parent.appendChild(base);
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
		// chrome.storage.sync.set({selection: seltext}, function() {
		// 	console.log("Highlighted selection has been updated.");
		// });
		var selRange = selection.getRangeAt(0).getBoundingClientRect();
		// var button = document.createElement('button');
		var parent = selection.anchorNode.parentElement;
		// button.id = "linguini-popup-button";
		// button.className = "linguini-clearable";
		// button.onclick = function() {
		// 	makePopup(parent, seltext, selRange.right, selRange.bottom);
		// }
		// button.style = "position:fixed; left:" + selRange.right + "px; top:" + selRange.bottom + "px;";
		// parent.appendChild(button);
		
		console.log("makeing popup");
		var base = document.createElement("div");
		var origText = document.createElement('p');
		var newText = document.createElement('p');
		origText.innerText = seltext;
		newText.innerText = "translated";
		base.appendChild(origText);
		base.appendChild(newText);
		base.id = "linguini-popup-base";
		base.className = "linguini-clearable";
		base.style = "position:fixed; background-color:#FFFFFF; left:"
		 + selRange.right + "px; top:" + selRange.bottom + "px;"
		 + " padding: 20px; border-radius: 10px; border-style: solid;"
		 + " border-width: 2px;";
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

document.addEventListener("keydown", function (event) {
	console.log(event.keyCode);
	if (event.keyCode == 84 && curSel != null) {
		makePopup(curSel);
	}
});
