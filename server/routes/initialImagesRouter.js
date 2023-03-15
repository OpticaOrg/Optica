const express = require("express");
const initialImageController = require("../controllers/initialImageController");
const router = express.Router();

router.post("/add_url", initialImageController.addURL, (req, res, next) => {
  res.status(200).json(res.locals.image);
});

module.exports = router;
