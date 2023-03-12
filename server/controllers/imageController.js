const mysql = require('mysql');
const uploadImageToBucket = require('../models/imageStorageModel');
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
imageController.saveImageToSQL = (req, res, next) => {
  //Upload the image to S3 bucket. Will recieve URL to store in mySQL.
  //I'M ASSUMING THE BLOB IS IN THE REQ.BODY AS "IMG" PROPERTY.
  const { img } = req.body;

  //If the upload to S3 fails return the error.
  let amazonURL;
  try {
    amazonURL = uploadImageToBucket(img);
  } catch (e) {
    return next({ e });
  }

  //Insert a new record for the Images table into the mySQL db.
  if (req.query.prompt) {
    console.log('Inside imageController.addImage middleware');
    con.connect((err) => {
      con.query(
        `INSERT INTO images (url, prompt) VALUES ('${amazonURL}', '${req.query.prompt}');`,
        function (error, result, fields) {
          if (result) {
            con.end();
            return next();
          }
        }
      );
    });
  } else {
    console.log('Missing an image parameter (either url or prompt)');
  }
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
    INNER JOIN keywords ON images_keywords.keyword_id = keywords.id 
    WHERE keywords.keyword = ?
    ORDER BY id DESC
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
