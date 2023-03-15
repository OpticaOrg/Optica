const mongoose = require("mongoose");

const timestamps = {
  createdAt: "created_at",
};

const imageSchema = new mongoose.Schema(
  {
    tags: [String],
    image: {
      type: Buffer,
      subtype: 0x00,
    },
  },
  { timestamps }
);

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
