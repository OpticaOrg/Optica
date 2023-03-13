const mysql = require('mysql');
require('dotenv').config();

const con = mysql.createConnection({
  host: process.env.AWS_ENDPOINT,
  user: process.env.AWS_USER,
  password: process.env.AWS_PASSWORD,
  database: 'main'
});

con.connect((err) => {
  if (err) throw err;
  console.log('Connected!');

  // This Model file was ran using node. Thus, the database (main) and tables (images, keywords, images_keywords) were created on AWS' mySQL database using the below mySQL queries.

  // con.query('CREATE DATABASE IF NOT EXISTS main;');
  // con.query('USE main;');
  // con.query('CREATE TABLE IF NOT EXISTS images(id int NOT NULL AUTO_INCREMENT, url varchar(255), prompt varchar(255), PRIMARY KEY(id));', function (error, result, fields) {
  //   console.log('images table: ', result);
  // });
  // con.query('CREATE TABLE IF NOT EXISTS keywords(id int NOT NULL AUTO_INCREMENT, keyword varchar(255), PRIMARY KEY(id));', function (error, result, fields) {
  //   console.log('keywords table: ', result);
  // });
  // con.query('CREATE TABLE IF NOT EXISTS images_keywords(image_id int NOT NULL, keyword_id int NOT NULL, PRIMARY KEY(image_id, keyword_id), FOREIGN KEY (image_id) REFERENCES images(id), FOREIGN KEY (keyword_id) REFERENCES keywords(id));', function (error, result, fields) {
  //   console.log('images_keywords table: ', result);
  // });

  con.end();
})
