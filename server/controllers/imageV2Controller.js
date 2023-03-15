const Image = require("../models/Image");

class ImageController {
  async saveImage(req, res, next) {
    try {
      const { image, tags } = req.body;
      console.log(image, tags);
      const response = await Image.create({ image });
      // console.log(response);
      res.locals.image = response;
      next();
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async getImageById(req, res, next) {
    try {
      const { id: _id } = req.query;
      const response = await Image.find({ _id });
      console.log(response);
      res.locals.image = response;
      next();
    } catch (err) {
      next(err);
    }
  }
}

const imageController = new ImageController();

module.exports = imageController;
