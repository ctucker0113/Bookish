import { clientCredentials } from "../utils/client";

// URL TO DATABASE FOR PROMISES/API CALLS
const endpoint = clientCredentials.databaseURL;

// Get All Author-Books in the Database
const getAllAuthorBooks = () => new Promise((resolve, reject) => {
    fetch(`${endpoint}/authorBooks.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => resolve(Object.values(data)))
      .catch(reject);
  });

// Create New Author/Book Relationship and immediately patch in the firebaseKey
const createAuthorBookRelationship = (payload) => new Promise((resolve, reject) => {
    fetch(`${endpoint}/authorBooks.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
  
      // After the Author object  is created, patch in the actual Firebase key for indexing.
      .then((data) => {
        const patchPayload = { firebaseKey: data.name }; // data.name is the generated key
        return fetch(`${endpoint}/authorBooks/${data.name}.json`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(patchPayload),
        }).then(() => resolve({ ...payload, firebaseKey: data.name }));
      })
      .catch(reject);
  });

// Gets all books associated with an author
const getAllBooksbyAnAuthor = (authorID) => new Promise((resolve, reject) => {
    fetch(`${endpoint}/books.json?orderBy="authorID"&equalTo="${authorID}"`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (typeof data === 'string') {
          resolve(data); // Resolve the string message directly
        } else {
          resolve(Object.values(data)); // Resolve as an array of items
        }
      })
      .catch(reject);
  });

// Deletes a single author-book from the database (without deleting the author from the database)
const deleteSingleAuthorBook = (authorBookID) => new Promise((resolve, reject) => {
    fetch(`${endpoint}/authorBooks/${authorBookID}.json`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json())
      .then((data) => resolve((data)))
      .catch(reject);
  });

// If you delete an author from the database, then this API call will delete all of the books associated with that author as well.

//TO-DO: This API call needs to be tested for bugs.
const deleteAuthorBooksRelationships = (firebaseKey) =>   new Promise((resolve, reject) => {
    getAllBooksbyAnAuthor(firebaseKey).then((authorBooksArray) => {
      const deleteAuthorPromises = authorBooksArray.map((event) => deleteBook(event.firebaseKey));
  
      Promise.all(deleteAuthorPartyPromises).then(() => {
        deleteAuthor(firebaseKey).then(resolve);
      });
    }).catch(reject);
  });

export {
  getAllAuthorBooks,
  createAuthorBookRelationship,
  getAllBooksbyAnAuthor,
  deleteSingleAuthorBook,
  deleteAuthorBooksRelationships
  }