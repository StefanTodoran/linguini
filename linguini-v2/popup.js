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