/**
 * @jest-environment jsdom
 */

document.body.innerHTML = `
  <form id="search-form">
    <input id="word-input" type="text">
    <button type="submit">Search</button>
  </form>

  <section id="results"></section>
  <p id="error-message"></p>
`;

const { handleSearch, displayWord } = require("../index.js");

describe("Wordly Single Page Application", () => {
  beforeEach(() => {
    document.querySelector("#word-input").value = "";
    document.querySelector("#results").innerHTML = "";
    document.querySelector("#error-message").textContent = "";
  });

  it("displays an error when the search input is empty", async () => {
    await handleSearch();

    const errorMessage = document.querySelector("#error-message");

    expect(errorMessage.textContent).toBe("Please enter a word.");
  });

  it("displays dictionary data after a successful search", async () => {
    const input = document.querySelector("#word-input");
    input.value = "hello";

    const mockData = [
      {
        word: "hello",
        phonetic: "/həˈloʊ/",
        phonetics: [
          {
            audio: "https://example.com/hello.mp3",
          },
        ],
        meanings: [
          {
            partOfSpeech: "noun",
            definitions: [
              {
                definition: "A greeting or expression of goodwill.",
              },
            ],
            synonyms: ["greeting", "salutation"],
          },
        ],
      },
    ];

    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      }),
    );

    await handleSearch();

    const results = document.querySelector("#results");
    const audio = results.querySelector("audio");

    expect(results.textContent).toContain("hello");
    expect(results.textContent).toContain("/həˈloʊ/");
    expect(results.textContent).toContain("noun");
    expect(results.textContent).toContain(
      "A greeting or expression of goodwill.",
    );
    expect(results.textContent).toContain("Synonyms: greeting, salutation");

    expect(audio).not.toBeNull();
    expect(audio.src).toBe("https://example.com/hello.mp3");
  });

  it("displays an error when the word is not found", async () => {
    const input = document.querySelector("#word-input");
    input.value = "asdfghjkl";

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
      }),
    );

    await handleSearch();

    const errorMessage = document.querySelector("#error-message");
    const results = document.querySelector("#results");

    expect(errorMessage.textContent).toBe("Word not found.");
    expect(results.innerHTML).toBe("");
  });

  it("handles missing pronunciation, synonyms, and audio", () => {
    const entry = {
      word: "test",
      phonetic: "",
      phonetics: [],
      meanings: [
        {
          partOfSpeech: "noun",
          definitions: [
            {
              definition: "A procedure used to evaluate something.",
            },
          ],
          synonyms: [],
        },
      ],
    };

    displayWord(entry);

    const results = document.querySelector("#results");
    const audio = results.querySelector("audio");

    expect(results.textContent).toContain("test");
    expect(results.textContent).toContain("Pronunciation not available");
    expect(results.textContent).toContain("Synonyms: None available");
    expect(audio).toBeNull();
  });

  it("replaces previous results with new results", () => {
    const firstEntry = {
      word: "hello",
      phonetic: "/həˈloʊ/",
      phonetics: [],
      meanings: [
        {
          partOfSpeech: "noun",
          definitions: [
            {
              definition: "A greeting.",
            },
          ],
          synonyms: [],
        },
      ],
    };

    const secondEntry = {
      word: "goodbye",
      phonetic: "/ɡʊdˈbaɪ/",
      phonetics: [],
      meanings: [
        {
          partOfSpeech: "noun",
          definitions: [
            {
              definition: "An expression used when leaving.",
            },
          ],
          synonyms: [],
        },
      ],
    };

    displayWord(firstEntry);
    displayWord(secondEntry);

    const results = document.querySelector("#results");

    expect(results.textContent).toContain("goodbye");
    expect(results.textContent).not.toContain("hello");
  });

  it("displays a user-friendly message when the API request fails", async () => {
    const input = document.querySelector("#word-input");
    input.value = "hello";

    global.fetch = jest.fn(() => Promise.reject(new Error("Failed to fetch")));

    await handleSearch();

    const errorMessage = document.querySelector("#error-message");
    const results = document.querySelector("#results");

    expect(errorMessage.textContent).toBe(
      "Unable to connect to the dictionary. Please try again later.",
    );

    expect(results.innerHTML).toBe("");
  });
});
