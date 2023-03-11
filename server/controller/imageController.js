const { json } = require('express');

const mysql = require('mysql');
require('dotenv').config();

const con = mysql.createConnection({
  host: process.env.AWS_ENDPOINT,
  user: process.env.AWS_USER,
  password: process.env.AWS_PASSWORD,
  database: 'main'
});

const imageController = {};

imageController.saveImageToSQL = (req, res, next) => {
  if (req.query.url && req.query.prompt) {
    console.log('Inside imageController.addImage middleware')
    con.connect((err) => {
      con.query(`INSERT INTO main.images (url, prompt) VALUES ('${req.query.url}', '${req.query.prompt}');`, function (error, result, fields) {
        // if (err) res.send(err);
        // if (result) res.send({ url: req.query.url, prompt: req.query.prompt });
        // if (result) res.send({ url: req.query.url, prompt: req.query.prompt });
        if (fields) console.log(fields);
        return next();
      })
    })
  } else {
    console.log('Missing an image parameter (either url or prompt)');
  }
};

imageController.getImageFromSQL = (req, res, next) => {
  console.log('Inside imageController.getImageFromSQL middleware');
  con.connect(function (err) {
    // con.query(`SELECT * FROM main.images`, function (err, result, fields) {
    con.query(`DESCRIBE main.images`, function (err, result, fields) {
      // if (err) res.send(err);
      // if (result) res.send(result);
      if (fields) console.log(fields);
      return next();
    });
  });
};

module.exports = imageController;