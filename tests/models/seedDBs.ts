const fs = require('fs');
const path = require('path');
const { keywords, prompts } = require('./seedHelper');
const mysql = require('mysql');
const uploadImageToBucket = require('../../server/models/imageStorageModel');
require('dotenv').config();
const util = require('util');


/*
PLEASE NOTE: RUNNING THIS FILE WILL SEED YOUR DATABASES WITH EVERY FILE IN SEEDIMGS. MAKE SURE YOU'RE READY.
*/

const con = mysql.createConnection({
  host: process.env.AWS_ENDPOINT,
  user: process.env.AWS_USER,
  password: process.env.AWS_PASSWORD,
  database: 'main'
});

// Seed the database with images within the seed images folder.
(async function seedDataBase () {
  const allImagesToSeedArray = await returnFilesAsArray();

  for (const img of allImagesToSeedArray) {
    // Sleep so AWS doesn't complain about moving to fast.
    // Generate random keywords.
    const randomPrompt = prompts[Math.floor(prompts.length * Math.random())];
    const randomKeyWord = keywords[Math.floor(keywords.length * Math.random())];

    // Do the image uploading.
    await saveImageToSQL(img, randomPrompt, randomKeyWord);
  }
  con.end();
})();

async function saveImageToSQL (givenPath, givenPrompt, givenKeyWord) {
  const img = fs.readFileSync(givenPath);
  const prompt = givenPrompt;
  const keyword = givenKeyWord;

  if (!img || !prompt || !keyword) { return next('Need an image, prompt, AND a keyword to upload.'); }

  let amazonURL;
  try {
    amazonURL = await uploadImageToBucket(img);
  } catch (e) {
    console.log(e);
    return;
  }

  console.log(`amazon url: ${amazonURL}`);

  if (!amazonURL) return next('Amazon upload failed.');

  let newImageId;

  const query = util.promisify(con.query).bind(con);

  const queryStringImagesTable = 'INSERT INTO images (url, prompt) VALUES (?, ?);';
  const queryParametersImagesTable = [amazonURL, prompt];

  newImageId = await query(queryStringImagesTable, queryParametersImagesTable);

  const queryStringKeywordsTable = 'INSERT INTO keywords (keyword) VALUES (?)';
  const queryParametersKeywordsTable = [keyword];

  try {
    await query(queryStringKeywordsTable, queryParametersKeywordsTable);
  } catch {}

  const queryStringImagesKeywordsTable = 'INSERT INTO images_keywords (image_id, keyword_id) VALUES (?, ?)';
  const queryParametersImagesKeywordsTable = [newImageId.insertId, keyword];

  con.query(
    queryStringImagesKeywordsTable,
    queryParametersImagesKeywordsTable,
    (err, result, fields) => {
      if (err) {
        console.log(err);
      }
    }
  );
}

async function sleep (time) {
  return await new Promise((resolve) => setTimeout(resolve, time));
}

// This function gives us all the file names within a folder.
async function returnFilesAsArray () {
  const folderPath = path.resolve(__dirname, 'seedImgs');
  const filesArray = [];

  try {
    const files = await fs.promises.readdir(folderPath);

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const stat = await fs.promises.stat(filePath);

      if (stat.isFile()) {
        filesArray.push(filePath);
      }
    }
  } catch (err) {
    console.error(err);
  }
  return filesArray;
}
