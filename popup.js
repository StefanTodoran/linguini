'use strict';

let selectLang = document.getElementById("languages");
let key = 'T';
let langid = 'en';
let languages;

window.onload = async function() {
	console.log("Popup onload function running...");
	var dropdown = document.getElementById('languages');
	languages = await getLanguages();
	for (let id of Object.keys(languages)) {
		const item = document.createElement('option');
		item.value = id;
		item.id = 'lang-element-' + id;
		item.innerText = languages[id].nativeName;
		dropdown.appendChild(item);
	}

	if (Object.keys(languages).length === 0) {
		const item = document.createElement('option');
		item.value = null;
		item.innerText = "Failed to load options";
		dropdown.appendChild(item);
	}

	chrome.storage.local.get(['hotkey'], function(result) {
		key = result.hotkey;
		console.log(result.hotkey);
		updateInfo(key,langid);
	});
	chrome.storage.local.get(['lang'], function(result) {
		langid = result.lang;
		console.log(result.lang);
		updateInfo(key,langid);
	});
}

selectLang.onchange = function(element) {
	langid = selectLang.options[selectLang.selectedIndex].value;
	chrome.storage.local.set({lang: langid}, function() { console.log("Language has been updated."); });
	updateInfo(key,langid);
};

function updateInfo(k,l_id) {
	changeHotkey.value = "Click to Change (" + k.charAt(0).toUpperCase() + k.slice(1) + ")";
	let selLangElement = document.getElementById('lang-element-' + l_id);
	if (selLangElement != null) {
		selLangElement.selected = true;
	}
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
		updateInfo(key,langid);
	}
});
