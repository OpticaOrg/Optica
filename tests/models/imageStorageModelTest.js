const uploadFile = require('../../server/models/imageStorageModel');

const path = require('path');

//Uploads an image within this tests/models folder to the database.
try {
  const returnedURL = uploadFile(path.resolve(__dirname, './cat.jpg'));
  console.log(returnedURL);
} catch (e) {
  console.log(e);
}
