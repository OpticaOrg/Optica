const fs = require('fs');
const mysql = require('mysql');
const uploadImageToBucket = require('../../server/models/imageStorageModel');
require('dotenv').config();
const path = require('path');
const util = require('util');

const con = mysql.createConnection({
  host: process.env.AWS_ENDPOINT,
  user: process.env.AWS_USER,
  password: process.env.AWS_PASSWORD,
  database: 'main'
});

const saveImageToSQL = async () => {
  //Upload the image to S3 bucket. Will recieve URL to store in mySQL.
  //I'M ASSUMING THE BLOB IS IN THE REQ.BODY AS "IMG" PROPERTY.
  const img = fs.readFileSync(path.resolve(__dirname, 'cat.jpg'));
  const prompt = 'cool kitty';
  const keyword = 'cat';

  if (!img || !prompt || !keyword)
    return next('Need an image, prompt, AND a keyword to upload.');

  //If the upload to S3 fails return the error.
  let amazonURL;
  try {
    amazonURL = await uploadImageToBucket(img);
  } catch (e) {
    console.log(e);
    return;
  }

  console.log(`amazon url: ${amazonURL}`);

  if (!amazonURL) return next('Amazon upload failed.');

  //These IDs are needed to update the join table.
  let newImageId, keywordKey;

  const query = util.promisify(con.query).bind(con);

  //Insert a new record for the Images table into the mySQL db.
  const queryStringImagesTable = `INSERT INTO images (url, prompt) VALUES (?, ?);`;
  const queryParametersImagesTable = [amazonURL, prompt];

  newImageId = await query(queryStringImagesTable, queryParametersImagesTable);

  //Insert a new record for the Keywords table into the mySQL db, if it doesn't already exist in the table.
  //If it does, select the keyword.
  const queryStringKeywordsTable = `INSERT INTO keywords (keyword) VALUES (?)`;
  const queryParametersKeywordsTable = [keyword];

  //This looks weird, but it works. You WILL get an error if the keyword already exists, but that's fine.
  try {
    await query(queryStringKeywordsTable, queryParametersKeywordsTable);
  } catch {}

  //TEST RETURN VAL IF THE INSERTED KEYWORD DOES NOT EXIST IN TABLE. ALSO TEST IF DOES EXIST IN TABLE. YOU WANT TO GET THE VALUE.

  //   Insert a new record for the images_keywords table into the mySQL db.
  const queryStringImagesKeywordsTable = `INSERT INTO images_keywords (image_id, keyword_id) VALUES (?, ?)`;
  const queryParametersImagesKeywordsTable = [newImageId.insertId, keyword];

  con.query(
    queryStringImagesKeywordsTable,
    queryParametersImagesKeywordsTable,
    (err, result, fields) => {
      if (err) {
        console.log(err);
        return;
      }
    }
  );
  console.log('done');
  return;
};

// saveImageToSQL();

// View the table.
const getImageFromSQL = () => {
  const pg = 1;

  con.connect(function (err) {
    const queryString = `SELECT url FROM images ORDER BY id DESC LIMIT 16 OFFSET ?`;
    const specificImageStartValue = pg * 16 - 16;
    const queryParameters = [specificImageStartValue];

    con.query(queryString, queryParameters, (err, result, fields) => {
      if (err) {
        console.log(err);
        return;
      }
      const urlArray = result.map((image) => image.url);
      console.log(urlArray);
    });
    if (err) console.log(err);
  });
};

// getImageFromSQL();

const getKeywords = () => {
  const pg = 1;

  con.connect(function (err) {
    const queryString = `SELECT * FROM keywords LIMIT 16 OFFSET ?`;
    const specificImageStartValue = pg * 16 - 16;
    const queryParameters = [specificImageStartValue];

    con.query(queryString, queryParameters, (err, result, fields) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(result);
    });
    if (err) console.log(err);
  });
};

// getKeywords();

const getJoinTable = () => {
  con.connect(function (err) {
    const queryString = `SELECT * FROM images_keywords;`;
    const queryParameters = [];

    con.query(queryString, queryParameters, (err, result, fields) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(result);
    });
    if (err) console.log(err);
  });
};

// getJoinTable();

const getSearchFromSQL = () => {
  const keyword = 'cactus';
  const pg = 1;

  con.connect(function (err) {
    const queryString = `SELECT url FROM images 
      INNER JOIN images_keywords ON images.id = images_keywords.image_id 
      INNER JOIN keywords ON images_keywords.keyword_id = keywords.keyword
      WHERE keywords.keyword = ?
      ORDER BY images.id DESC
      LIMIT 16 OFFSET ?`;

    const specificImageStartValue = pg * 16 - 16;
    const queryParameters = [keyword, specificImageStartValue];

    con.query(queryString, queryParameters, (err, result, fields) => {
      if (err) {
        console.log(err);
        return;
      }

      console.log(result);
      return;
    });
    if (err) console.log(err);
  });
};

// getSearchFromSQL();
