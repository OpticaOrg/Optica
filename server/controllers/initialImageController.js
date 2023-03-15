const InitialImage = require("../models/InitialImage");

class InitialImageController {
  async addURL(req, res, next) {
    const { url } = req.body;
    try {
      const response = await InitialImage.create({ url });
      console.log("InitImage", response);
      res.locals.image = response;
      next();
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

const initialImageController = new InitialImageController();

module.exports = initialImageController;
