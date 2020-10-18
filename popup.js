'use strict';

let langInfo = document.getElementById('langInfo');
let selectLang = document.getElementById("languages");
let key = 't';
let langid = 'en';
let languages;

window.onload = async function() {
	console.log("Popup onload function running...");
	var dropdown = document.getElementById('languages');
	languages = await getLanguages();
	
	for (let id of Object.keys(languages)) {
		var item = document.createElement('option');
		item.value = id;
		item.innerText = languages[id].name;
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
	let l = languages[l_id].name;
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
		updateInfo(key,langid);
	}
});
