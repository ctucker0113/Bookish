import { clientCredentials } from "../utils/client";

// URL TO DATABASE FOR PROMISES/API CALLS
const endpoint = clientCredentials.databaseURL;

// Get All Books associated with a given tag
const getAllBooksbySingleTag = (tagID) => new Promise((resolve, reject) => {
    fetch(`${endpoint}/bookTags.json`)
      .then((response) => response.json())

      // Check if the data returned is null. If it is, return an empty array.
      .then((data) => {
        if (!data) return resolve([]);

        // Filter down to just the book tags that match the tagID.
        const filteredBookTags = Object.values(data).filter((entry) => entry.tagID === tagID);

        // Then take the bookID located in each of the remaining bookTag objects and find the book associated with that ID.
        const bookFetches = filteredBookTags.map((entry) =>
          fetch(`${endpoint}/books/${entry.bookId}.json`)
            .then((res) => res.json())
            .then((book) => ({ ...book, firebaseKey: entry.bookId }))
        );

        Promise.all(bookFetches).then(resolve).catch(reject);
      })
      .catch(reject);
  });

const getAllTagsForABook = (bookID) => new Promise((resolve, reject) => {
    fetch(`${endpoint}/bookTags.json`)
      .then((res) => res.json())
      .then((data) => {
        if (!data) return resolve([]);


        // Filter the returned bookTag data down to just the entries with a matching book ID.
        const filteredTagLinks = Object.values(data).filter((entry) => entry.bookId === bookID);

        // Retrieve the tagID from the filtered bookTag objects and fetch the corresponding tags with those ID's.
        const tagFetches = filteredTagLinks.map((entry) =>
          fetch(`${endpoint}/tags/${entry.tagID}.json`)
            .then((res) => res.json())
            .then((tag) => ({ ...tag, firebaseKey: entry.tagID }))
        );

        Promise.all(tagFetches).then(resolve).catch(reject);
      })
      .catch(reject);
  });

export default {
  getAllBooksbySingleTag,
  getAllTagsForABook
}
