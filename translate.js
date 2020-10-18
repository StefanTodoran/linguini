import keys from keys;

function microsoftLanguages(callback) {
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", keys.microsoft.endpoint);
    xhttp.send();
	xhttp.onload = function() {
		callback(xhttp.response);
	}
}

function microsoftTranslate(text, targetLanguage, callback) {
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", keys.microsoft.endpoint + "&to=" + targetLanguage);
	xhttp.setRequestHeader('Ocp-Apim-Subscription-Key', keys.microsoft.key1);
	xhttp.setRequestHeader('Content-Type', 'application/json');
	xhttp.send(JSON.stringify([{"text": text}]));
	xhttp.onload = function() {
		callback(xhttp.response);
	}
}

function googleLanguages(callback) {
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", keys.google.endpoint + "/langauges?key=" + keys.google.key);
    xhttp.send();
	xhttp.onload = function() {
	  callback(xhttp.response);
	}
}

function googletranslate(text, targetLanguage, callback) {
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", keys.google.endpoint + "?key=" + keys.google.key);
	xhttp.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
	xhttp.send('{"q": ["' + text + '"], "target": "' + targetLanguage + '"}');
	xhttp.onload = function() {
	  callback(xhttp.response);
	}
}
