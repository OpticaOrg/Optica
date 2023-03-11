const path = require('path');
const express = require('express');
const imageController = require('./controllers/imageController');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded());

app.get('/images', imageController.getImageFromSQL, (req, res) => {
  return res.status(200).json(res.locals.urls);
});

app.post('/images', imageController.saveImageToSQL, (req, res) => {
  return res.status(200).send('Image saved to database!');
});

// catch-all route handler for any requests to an unknown route
app.use((req, res) =>
  res.status(404).send("This is not the page you're looking for...")
);

/**
 * Global error handler -- CHANGE TO NOT SHOW CLIENT ANYTHING TOO SPECIFIC, BUT RATHER SHOW A GENERIC CONSOLE LOG FOR NOW. CAN CHANGE TO AN ERROR PAGE/RESPONSE LATER?
 */
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
