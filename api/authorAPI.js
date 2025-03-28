import { clientCredentials } from "../utils/client";

// URL TO DATABASE FOR PROMISES/API CALLS
const endpoint = clientCredentials.databaseURL;
// Get a Single Book by BookID firebaseKey

// Get All Books in the Database
const getAllAuthors = () => new Promise((resolve, reject) => {
  fetch(`${endpoint}/authors.json`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve(Object.values(data)))
    .catch(reject);
});

// Get a Single Author by their authorID (Firebase Key)
const getSingleAuthor = (firebaseKey) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/authors/${firebaseKey}.json`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});

  // Create New Author
const createAuthor = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/authors.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => resolve((data)))
    .catch(reject);
});

// Update Author (Predominantly for patching in the firebaseKey into the object itself after initial creation)
  const updateAuthor = (payload) => new Promise((resolve, reject) => {
    fetch(`${endpoint}/authors/${payload.firebaseKey}.json`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.text())
      .then((data) => resolve((data)))
      .catch(reject);
  });

export {
  getAllAuthors,
  getSingleAuthor,
  createAuthor,
  updateAuthor
}
