// The app uses google translate and deepL translate. We only want to translate if we can
// offer multiple, so we are limited by deepL's smaller language list:
const codes = {
  "Bulgarian": "bg",
  "Chinese": "zh",
  "Czech": "cs",
  "Danish": "da",
  "Dutch": "nl",
  "English": "en",
  "Estonian": "et",
  "Finnish": "fi",
  "French": "fr",
  "German": "de",
  "Greek": "el",
  "Hungarian": "hu",
  "Indonesian": "id",
  "Italian": "it",
  "Japanese": "ja",
  "Latvian": "lv",
  "Lithuanian": "lt",
  "Polish": "pl",
  "Portuguese": "pt",
  "Romanian": "ro",
  "Russian": "ru",
  "Slovak": "sk",
  "Slovenian": "sl",
  "Spanish": "es",
  "Swedish": "sv",
  "Turkish": "tr",
  "Ukrainian": "uk",
};
const languages = Object.keys(codes);
var native_lang = "en";

// Takes starting language and target language as well as some text payload,
// returns the url that would translate that query via google translate. Example:
// https://translate.google.com/?sl=en&tl=es&text=translation%20text%20goes%20here&op=translate
function makeGoogleQuery(start, target, payload) {
  const base = "https://translate.google.com/";
  const text = encodeURI(payload);
  const query = `?sl=${start}&tl=${target}&text=${text}&op=translate`;

  return base + query;
}

// Takes starting language and target language as well as some text payload,
// returns the url that would translate that query via deepL. Example:
// https://www.deepl.com/translator#en/es/translation%20text%20goes%20here
function makeDeepLQuery(start, target, payload) {
  const base = "https://www.deepl.com/translator";
  const text = encodeURI(payload);
  const query = `#${start}/${target}/${text}`;

  return base + query;
}

function populateLanguageOptions() {
  const select = document.getElementById('languages');

  for (let i = 0; i < languages.length; i++) {
    const option = document.createElement('option');
    option.value = codes[languages[i]];
    option.innerHTML = `${languages[i]} (${codes[languages[i]]})`;

    select.appendChild(option);
  }

  select.value = native_lang;
}

populateLanguageOptions();
const select = document.getElementById('languages');
select.addEventListener('change', () => {
  native_lang = select.value;
  console.log("Set native language to: ", native_lang);
});

async function getTranslationPage(url) {
  let doc;
  await fetch(url, { mode: 'no-cors'}).then( function (response) {
    console.log(response);
    return response.text();
  }).then(function (html) {
  
    // Convert the HTML string into a document object
    const parser = new DOMParser();
    doc = parser.parseFromString(html, 'text/html');
  }).catch(function (err) {
    // There was an error
    console.warn(`Something went wrong fetching ${url}`, err);
  });
  console.log(url, "\n\n--->\n\n", doc);
  return doc;
}

function injectTranslationPopup() {

}

const google_test = makeGoogleQuery("en", "es", "translation text goes here");
const deepl_test = makeDeepLQuery("en", "es", "translation text goes here");
console.log(google_test);
console.log(deepl_test);

getTranslationPage(google_test);
getTranslationPage(deepl_test);