# Wordly

Wordly is a single-page dictionary application that allows users to search for English words and view information about them.

## Features

- Search for an English word
- View the word's pronunciation
- View definitions and parts of speech
- View available synonyms
- Play pronunciation audio when available
- Display fallback messages when information is unavailable
- Handle empty searches and invalid words
- Handle API/network errors
- Update results dynamically without reloading the page
- Responsive and accessible interface

## Technologies Used

- HTML
- CSS
- JavaScript
- Fetch API
- Async/Await
- Jest
- jsdom
- Free Dictionary API

## How to Use

1. Enter a word in the search field.
2. Click the Search button.
3. View the word's pronunciation, definitions, synonyms, and available audio.

## Testing

Run the test suite with:

npm test

The tests cover input validation, successful dictionary results, invalid words, missing dictionary data, dynamic result replacement, and API/network errors.

## API

Wordly uses the Free Dictionary API:

https://api.dictionaryapi.dev/api/v2/entries/en/<word>

During development, the API experienced a server-side outage. Wordly includes error handling so users receive a readable message when the dictionary service is unavailable.

## Author

Created by a-gbatie