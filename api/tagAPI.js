import { clientCredentials } from "../utils/client";

// URL TO DATABASE FOR PROMISES/API CALLS
const endpoint = clientCredentials.databaseURL;

// Get All Tags in the Database
const getAllTags = () => new Promise((resolve, reject) => {
  fetch(`${endpoint}/tags.json`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve(Object.values(data)))
    .catch(reject);
});

// Get a Single Tag by tag.firebaseKey)
const getSingleTag = (firebaseKey) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/tags/${firebaseKey}.json`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});

// Create New Tag and immediately patch in the firebaseKey
const createTag = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/tags.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())

    // After the Firebase element is created, patch in the actual Firebase key for indexing.
    .then((data) => {
      const patchPayload = { firebaseKey: data.name }; // data.name is the generated key
      return fetch(`${endpoint}/tags/${data.name}.json`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patchPayload),
      }).then(() => resolve({ ...payload, firebaseKey: data.name }));
    })
    .catch(reject);
});

const deleteTag = (firebaseKey) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/tags/${firebaseKey}.json`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json())
    .then((data) => resolve((data)))
    .catch(reject);
});

export {
  getAllTags,
  getSingleTag,
  createTag,
  deleteTag
}
