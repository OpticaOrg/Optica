const mysql = require('mysql');
require('dotenv').config();

// connection to AWS-RDS mySQL database using the credentials stored in the .env file.
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

  // // the below queries were used to reset the database tables due to an incorrect initial schema.
  // con.query('DROP TABLE images_keywords');
  // con.query('DROP TABLE keywords');
  // con.query('DROP TABLE images');
  // con.query('SHOW TABLES', (err, res, fields) => {
  //   console.log(res);
  // });

  // // creates our images table in AWS-RD mySQL with id, url, and prompt attributes
  // con.query('CREATE DATABASE IF NOT EXISTS main;');
  // con.query('USE main;');
  // con.query(
  //   'CREATE TABLE IF NOT EXISTS images(id int NOT NULL AUTO_INCREMENT, url varchar(255), prompt varchar(255), PRIMARY KEY(id));',
  //   function (error, result, fields) {
  //     console.log('images table: ', result);
  //   }
  // );

  // // creates our keywords table in AWS-RD mySQL with just a keyword attribute
  // con.query(
  //   'CREATE TABLE IF NOT EXISTS keywords(keyword varchar(255) NOT NULL UNIQUE, PRIMARY KEY(keyword));',
  //   function (error, result, fields) {
  //     console.log('keywords table: ', result);
  //   }
  // );

  // // creates our images_keywords join table in AWS-RD mySQL
  // con.query(
  //   'CREATE TABLE IF NOT EXISTS images_keywords(image_id int NOT NULL, keyword_id varchar(255) NOT NULL, PRIMARY KEY(image_id, keyword_id), FOREIGN KEY (image_id) REFERENCES images(id), FOREIGN KEY (keyword_id) REFERENCES keywords(keyword));',
  //   function (error, result, fields) {
  //     console.log('images_keywords table: ', result);
  //     console.log(err);
  //   }
  // );

  // con.query('SHOW TABLES', (err, res, fields) => {
  //   console.log(res);
  //   debugger;
  // });

  con.end();
});
