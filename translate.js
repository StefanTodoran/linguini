import keys from keys;

function microsoftTranslate(text, targetLanguage, callback) {
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", keys.microsoft.endpoint + "translate?api-version=3.0&to=" + targetLanguage);
	xhttp.setRequestHeader('Ocp-Apim-Subscription-Key', keys.microsoft.key1);
	xhttp.setRequestHeader('Content-Type', 'application/json');
	xhttp.send(JSON.stringify([{"text": text}]));
	xhttp.onload = function() {
		callback(xhttp.response);
	}
}

function googletranslate(text, targetLanguage, callback) {
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", keys.google.endpoint + "language/translate/v2?key=" + keys.google.key);
	xhttp.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
	xhttp.send('{"q": ["' + text + '"], "target": "' + targetLanguage + '"}');
	xhttp.onload = function() {
	  callback(xhttp.response);
	}
}