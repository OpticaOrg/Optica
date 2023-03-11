const path = require('path');
const express = require('express');
const imageController = require('./controller/imageController');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded());

app.get('/images', imageController.getImageFromSQL, (req, res) => {
  return res.status(200).send('Image retrieved from database!');
});

app.post('/images', imageController.saveImageToSQL, (req, res) => {
  return res.status(200).send('Image saved to database!');
})

// catch-all route handler for any requests to an unknown route
app.use((req, res) =>
  res.status(404).send("This is not the page you're looking for...")
);

/**
 * Global error handler
 */
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
