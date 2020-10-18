'use strict';

let langInfo = document.getElementById('langInfo');
let changeLang = document.getElementById('changeLang');
let key = 't';
let lang = 'English';
let languages;

window.onload = async function() {
	console.log("onload function running...");
	chrome.storage.local.get(['hotkey'], function(result) { 
		key = result.hotkey; 
		console.log(result.hotkey);
		updateInfo(key,lang);
	});

	var dropdown = document.getElementById('languages');
	languages = await getLanguages();
	for (let id of Object.keys(languages)) {
		var item = document.createElement('option');
		item.value = id;
		item.innerText = languages[id].name;
		dropdown.appendChild(item);
	}
	console.log(key);
	//lang = await chrome.storage.sync.get(['lang'], function(result) {console.log(result.key);});
}

changeLang.onclick = function(element) {
	let selectLang = document.getElementById("languages");
	let langid = selectLang.options[selectLang.selectedIndex].value;
	lang = languages[langid].name;
	updateInfo(key,lang);
};

function updateInfo(k,l) {
	changeHotkey.value = "Click to Change ("+k+")";
	langInfo.textContent = "Currently translating into "+l+".";
}

let changeHotkey = document.getElementById('changeHotkey');
let waiting = false; //if we are waiting for the user to enter a new hotkey

changeHotkey.onclick = function(element) {
	if (!waiting) {
		changeHotkey.value = "Enter any key...";
		waiting = true;
	}
};

document.addEventListener("keydown", function (event) {
	if (waiting) {
		console.log(event.key);
		chrome.storage.local.set({hotkey: event.key}, function() { console.log("Hotkey has been updated."); });
		waiting = false;
		key = event.key;
		updateInfo(key,lang);
	}
});
