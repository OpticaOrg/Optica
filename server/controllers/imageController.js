const mysql = require('mysql');
const uploadImageToBucket = require('../models/imageStorageModel');
const util = require('util');
require('dotenv').config();

const con = mysql.createConnection({
  host: process.env.AWS_ENDPOINT,
  user: process.env.AWS_USER,
  password: process.env.AWS_PASSWORD,
  database: 'main'
});

const imageController = {};

/*
Function does two things:
1) Uploads the image to the S3 bucket using uploadImageToBucket(), which returns a URL.
2) Updates the mySQL table with the URL from #1. 
*/
imageController.saveImageToSQL = async (req, res, next) => {
  //Upload the image to S3 bucket. Will recieve URL to store in mySQL.
  //I'M ASSUMING THE BLOB IS IN THE REQ.BODY AS "IMG" PROPERTY.
  const { img } = req.body;
  const { prompt } = req.body;
  const { keyword } = req.body;

  if (!img || !prompt || !keyword)
    return next('Need an image, prompt, AND a keyword to upload.');

  //If the upload to S3 fails return the error.
  let amazonURL;
  try {
    amazonURL = await uploadImageToBucket(img);
  } catch (e) {
    return next(e);
  }

  if (!amazonURL) return next('Amazon upload failed.');

  //The newly inserted image ID is required for the join table.
  let newImageId;

  //See https://stackoverflow.com/questions/57420576/how-to-synchronously-upload-files-to-s3-using-aws-sdk
  const query = util.promisify(con.query).bind(con);

  //Insert a new record for the Images table into the mySQL db.
  const queryStringImagesTable = `INSERT INTO images (url, prompt) VALUES (?, ?);`;
  const queryParametersImagesTable = [amazonURL, prompt];

  try {
    newImageId = await query(
      queryStringImagesTable,
      queryParametersImagesTable
    );
  } catch (e) {
    return next(e);
  }

  //Insert a new record for the Keywords table into the mySQL db, if it doesn't already exist in the table.
  const queryStringKeywordsTable = `INSERT INTO keywords (keyword) VALUES (?)`;
  const queryParametersKeywordsTable = [keyword];

  //This looks weird, but it works. You WILL get an error if the keyword already exists, but that's fine.
  //Ideally, you'd do some real error handling to make sure it's not an issue with the database.
  try {
    await query(queryStringKeywordsTable, queryParametersKeywordsTable);
  } catch {}

  //Insert a new record for the images_keywords table into the mySQL db.
  const queryStringImagesKeywordsTable = `INSERT INTO images_keywords (image_id, keyword_id) VALUES (?, ?)`;
  const queryParametersImagesKeywordsTable = [newImageId.insertId, keyword];

  con.query(
    queryStringImagesKeywordsTable,
    queryParametersImagesKeywordsTable,
    (err, result, fields) => {
      if (err) {
        return next(err);
      }
    }
  );
  return next();
};

//Get 16 images (paginated) from the SQL database sorted by most recent.
imageController.getImageFromSQL = (req, res, next) => {
  const { pg } = req.query;

  con.connect(function (err) {
    const queryString = `SELECT url FROM images ORDER BY id DESC LIMIT 16 OFFSET ?`;
    const specificImageStartValue = pg * 16 - 16;
    const queryParameters = [specificImageStartValue];

    con.query(queryString, queryParameters, (err, result, fields) => {
      if (err) return next({ err });
      const urlArray = result.map((image) => image.url);
      res.locals.urls = urlArray;
      return next();
    });
    if (err) return next({ e });
  });
};

//Get 16 (paginated) images based on a given query string.
imageController.getSearchFromSQL = (req, res, next) => {
  const { keyword } = req.query;
  const { pg } = req.query;

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
      if (err) return next({ err });

      console.log(result);
      const urlArray = result.map((image) => image.url);
      res.locals.urls = urlArray;
      return next();
    });
    if (err) return next({ e });
  });
};

module.exports = imageController;
