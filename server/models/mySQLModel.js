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
  // con.query('CREATE DATABASE IF NOT EXISTS main;');
  con.query('USE main;');
  // con.query('CREATE TABLE IF NOT EXISTS images(id int NOT NULL AUTO_INCREMENT, url varchar(255), prompt varchar(255), PRIMARY KEY(id));', function (error, result, fields) {
  //   console.log('image table: ', result);
  // });
  // con.query('CREATE TABLE IF NOT EXISTS keywords(id int NOT NULL AUTO_INCREMENT, keyword varchar(255), PRIMARY KEY(id));', function (error, result, fields) {
  //   console.log('keyword table: ', result);
  // });
  con.end();
})


