var keys = null;

fetch(chrome.runtime.getURL("keys.json")).then(result => result.json()).then(result => keys = result);

/**
 * Provides Linguini's supported languages.
 * @return {Object}
 *         Keys: "id"
 *         Values: "name", "nativeName", "direction"
 */
async function getLanguages() {
    var microsoftLanguages = await getMicrosoftLanguages();
    var googleLanguages = await getGoogleLanguages();
    var languages = {};
    for (var [id, language] of Object.entries(microsoftLanguages)) {
        if (googleLanguages.includes(id)) {
            languages[id] = {
                name: language.name,
                nativeName: language.nativeName,
                direction: language.dir
            }
        }
    }
    return languages;
}

/**
 * Provides Microsoft's supported languages.
 * @return {Object}
 *         Keys: "id"
 *         Values: "name", "nativeName", "dir"
 */
async function getMicrosoftLanguages() {
    var response = await fetch("https://api.cognitive.microsofttranslator.com/languages?api-version=3.0", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    response = await response.json();
    var languages = response.translation;
    return languages;
}

/**
 * Provides Microsoft's translation for a given text.
 * @param  {String} text   
 *         The text to be translated.
 * @param  {String} targetLanguage
 *         The language the text will be translated to.
 * @return {Object}
 *         Values: "detected", "confidence", "text"
 */
async function microsoftTranslate(text, targetLanguage) {
    var response = await fetch("https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=" + targetLanguage, {
        method: 'POST',
        headers: {
            'Ocp-Apim-Subscription-Key': keys.microsoft.key,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify([{
            "text": text
        }])
    });
    response = await response.json();
    var translation = {
        detected: response[0].detectedLanguage.language,
        confidence: response[0].detectedLanguage.score,
        text: response[0].translations[0].text
    }
    return translation;
}


/**
 * Provides Google's supported languages.
 * @return {Array}
 *         Values: "id"
 */
async function getGoogleLanguages() {
    var response = await fetch("https://translation.googleapis.com/language/translate/v2/languages?key=" + keys.google.key, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    response = await response.json();
    var languages = [];
    response.data.languages.forEach(element => languages.push(element.language));
    return languages;
}

/**
 * Provides Google's translation for a given text.
 * @param  {String} text   
 *         The text to be translated.
 * @param  {String} targetLanguage
 *         The language the text will be translated to.
 * @return {Object}
 *         Values: "detected", "text"
 */
async function googleTranslate(text, targetLanguage) {
    var response = await fetch("https://translation.googleapis.com/language/translate/v2?key=" + keys.google.key, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "q": [text], 
            "target": targetLanguage
        })
    });
    response = await response.json();
    var translation = {
        detected: response.data.translations[0].detectedSourceLanguage,
        text: response.data.translations[0].translatedText
    }
    return translation;
}
