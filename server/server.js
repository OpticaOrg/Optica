const path = require('path');
const express = require('express');

const app = express();
const PORT = 3000;

const imageController = require('./controllers/imageController');

app.use(express.json());
app.use(express.urlencoded());


// route to retrieve landing page of images
app.get('/images', imageController.getImageFromSQL, (req, res) => {
  return res.status(200).json(res.locals.urls);
});

// route to save an image to the SQL database
app.post('/images', imageController.saveImageToSQL, (req, res) => {
  return res.status(200).send('Image saved to database!');
});

// route to search for images based on a given keyword
app.get('/search', imageController.getSearchFromSQL, (req, res) => {
  return res.status(200).json(res.locals.urls);
});

// catch-all route handler for any requests to an unknown route
app.use((req, res) =>
  res.status(404).send("This is not the page you're looking for...")
);


// Global error handler -- CHANGE TO NOT SHOW CLIENT ANYTHING TOO SPECIFIC, BUT RATHER SHOW A GENERIC CONSOLE LOG FOR NOW. CAN CHANGE TO AN ERROR PAGE/RESPONSE LATER?
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send('Something broke!');
});


app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
