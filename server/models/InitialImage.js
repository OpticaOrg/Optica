const mongoose = require("mongoose");

const initialImageSchema = new mongoose.Schema({
  url: String,
  width: Number,
  height: Number,
  size: Number,
  prompt: Array,
  imageID: Number,
});

const InitialImage = mongoose.model("initialImage", initialImageSchema);

module.exports = InitialImage;
