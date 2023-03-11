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

imageController.saveImageToSQL = (req, res, next) => {
  //Upload the image to S3 bucket. Will recieve URL to store in mySQL.
  //I'M ASSUMING THE BLOB IS IN THE REQ.BODY AS "IMG" PROPERTY.
  const { img } = req.body;

  //If the upload fails return the error.
  let amazonURL;
  try {
    amazonURL = uploadImageToBucket(img);
  } catch (e) {
    return next({ e });
  }

  if (req.query.prompt) {
    console.log('Inside imageController.addImage middleware');
    con.connect((err) => {
      con.query(
        `INSERT INTO main.images (url, prompt) VALUES ('${amazonURL}', '${req.query.prompt}');`,
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

imageController.getImageFromSQL = (req, res, next) => {
  con.connect(function (err) {
    con.query(
      `SELECT * FROM main.images ORDER BY RAND() LIMIT 16`,
      function (err, result, fields) {
        if (err) return next({ err });

        console.log(result);
        const urlArray = result.map((image) => image.url);
        res.locals.urls = urlArray;
        return next();
      }
    );
    if (err) return next({ e });
  });
};

module.exports = imageController;
