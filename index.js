// Connect JS to elements in index.html

const form = document.querySelector("#search-form");
const input = document.querySelector("#word-input");
const results = document.querySelector("#results");
const errorMessage = document.querySelector("#error-message");
const dictionaryApi = "https://api.dictionaryapi.dev/api/v2/entries/en";

// Add event listener to form, .preventDefault() prevents browser from refreshing, seperate searching handling in another function

form.addEventListener("submit", (e) => {
  e.preventDefault();
  handleSearch();
});

// function to handle searching

async function handleSearch() {
  const word = input.value.trim();

  if (!word) {
    errorMessage.textContent = "Please enter a word.";
    results.innerHTML = "";
    return;
  };

  try {
    const response = await fetch(`${dictionaryApi}/${word}`);

    if (!response.ok) {
      throw new Error("Word not found.");
    };

    const data = await response.json();
    const entry = data[0];

    errorMessage.textContent = "";
    displayWord(entry);
    input.value = "";
  } catch (error) {
    results.innerHTML = "";

    if (error.message === "Word not found.") {
      errorMessage.textContent = error.message;
    } else {
      errorMessage.textContent =
        "Unable to connect to the dictionary. Please try again later.";
    };
  };
};

// function to display word

function displayWord(entry) {
  results.innerHTML = "";

  const wordTitle = document.createElement("h2");
  wordTitle.textContent = entry.word;

  const phonetic = document.createElement("p");
  phonetic.textContent = entry.phonetic || "Pronunciation not available";

  results.append(wordTitle, phonetic);

  const audioSource = entry.phonetics.find((item) => item.audio);

  if (audioSource) {
    const audio = document.createElement("audio");
    audio.controls = true;
    audio.src = audioSource.audio;

    results.append(audio);
  };

  entry.meanings.forEach((meaning) => {
    const partOfSpeech = document.createElement("h3");
    partOfSpeech.textContent = meaning.partOfSpeech;

    results.append(partOfSpeech);

    meaning.definitions.forEach((item) => {
      const definition = document.createElement("p");
      definition.textContent = item.definition;

      results.append(definition);
    });

    const synonyms = document.createElement("p");

    if (meaning.synonyms.length > 0) {
      synonyms.textContent = `Synonyms: ${meaning.synonyms.join(", ")}`;
    } else {
      synonyms.textContent = "Synonyms: None available";
    };

    results.append(synonyms);
  });
};

if (typeof module !== "undefined") {
  module.exports = {
    handleSearch,
    displayWord,
  };
};

// API was down, created a test entry to see if the data was properly rendering.

// const testEntry = {
//   word: "hello",
//   phonetic: "/həˈloʊ/",
//   phonetics: [
//     {
//       text: "/həˈloʊ/",
//       audio: "https://api.dictionaryapi.dev/media/pronunciations/en/hello-us.mp3"
//     }
//   ],
//   meanings: [
//     {
//       partOfSpeech: "noun",
//       definitions: [
//         {
//           definition: "A greeting or expression of goodwill."
//         }
//       ],
//       synonyms: ["greeting", "salutation"]
//     },
//     {
//       partOfSpeech: "interjection",
//       definitions: [
//         {
//           definition: "Used as a greeting when meeting someone."
//         }
//       ],
//       synonyms: []
//     }
//   ]
// };

// displayWord(testEntry);
