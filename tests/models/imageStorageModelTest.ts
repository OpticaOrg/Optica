const uploadFile = require('../../server/models/imageStorageModel');
const fs = require('fs');
const path = require('path');

//Uploads an image within this tests/models folder to the database.
const test = async () => {
  try {
    const blob = fs.readFileSync(path.resolve(__dirname, 'cat.jpg'));
    const returnedURL = await uploadFile(blob);
    console.log(returnedURL);
  } catch (e) {
    console.log(e);
  }
};

// test();
