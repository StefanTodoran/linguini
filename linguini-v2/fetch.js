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

// Fetches the provided translation page, then uses a DOM parser
// to grab the translation data from the provided element that contains it.
async function getTranslationPage(url, container) {
  let doc;
  await fetch(url).then( function (response) {
    console.log(response);
    return response.text();
  }).then(function (html) {
  
    // Convert the HTML string into a document object
    const parser = new DOMParser();
    doc = parser.parseFromString(html, 'text/html');
  }).catch(function (err) {
    // There was an error
    console.warn(`(!) Something went wrong fetching ${url}`, err);
  });
  console.log(url, "\n\n--->\n\n", doc);
  return doc;
}

const google_test = makeGoogleQuery("en", "es", "translation text goes here");
const deepl_test = makeDeepLQuery("en", "es", "translation text goes here");

getTranslationPage(google_test);
getTranslationPage(deepl_test);