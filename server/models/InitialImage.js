const mongoose = require("mongoose");

const initialImageSchema = new mongoose.Schema({
  url: String,
});

const InitialImage = mongoose.model("initialImage", initialImageSchema);

module.exports = InitialImage;
