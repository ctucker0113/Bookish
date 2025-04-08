// TO-DO: These API calls need to be tested for bugs. I'm not 100% sure they will work as intended, and there's not really a way to test this in Postman.

import { clientCredentials } from "../utils/client";

// URL TO DATABASE FOR PROMISES/API CALLS
const endpoint = clientCredentials.databaseURL;

// Get all of a user's books by userID
const getAllUserBooks = (userID) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/userBooks.json`)
    .then((response) => response.json())

    // Check if the data returned is null. If it is, return an empty array.
    .then((data) => {
      if (!data) return resolve([]);

      // Filter down to just the userBooks that contain the userID parameter.
      const filteredUserBooks = Object.values(data).filter((entry) => entry.userID === userID)

      // Then take the bookID in each of the remaining userBook objects and find the book associated with that ID.
      const bookFetches = filteredUserBooks.map((entry) =>
        fetch(`${endpoint}/books/${entry.bookID}.json`)
          .then((res) => res.json())
          .then((book) => ({ ...book, firebaseKey: entry.bookID }))
      );

      Promise.all(bookFetches).then(resolve).catch(reject);
    })
    .catch(reject);
});


// Creates a relationship between a book and a user, allowing the user to "favorite" books or add them to their wishlist.
// TO-DO (Maybe): Probably need to patch in a new attribute into the object called userBookID, which will be a fusing of the userID and the bookID.
const createUserBook = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/userBooks.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});

// Deletes the relationship between a user and a book, allowing them to un-favorite it or remove it from their wishlist.
const deleteUserBook = (userID, bookID) => new Promise((resolve, reject) => {
  const userBookID = `${userID}_${bookID}`
  fetch(`${endpoint}/userBooks.json?orderBy="userBookID"&equalTo="${userBookID}"`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json())
    .then((data) => resolve((data)))
    .catch(reject);
});

export {
  getAllUserBooks,
  createUserBook,
  deleteUserBook
}
