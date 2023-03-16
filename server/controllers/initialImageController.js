const InitialImage = require('../models/InitialImage');
const fs = require('fs');
const path = require('path');

class InitialImageController {
  async addURL(req, res, next) {
    const { URLArray } = res.locals;
    try {
      for (let i = 0; i < URLArray.length; i++) {
        let { url, width, height, size, prompt, imageID } = URLArray[i];
        width = Number(width);
        height = Number(height);
        size = Number(size);
        const response = await InitialImage.create({
          url,
          width,
          height,
          size,
          prompt,
          imageID
        });
        console.log('InitImage', i, response);
      }
      return next();
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async populate(req, res, next) {
    const URLArray = [];
    let j = 1;
    console.log('In populate');
    for (let i = 1; i <= 272; i++) {
      console.log(i);
      const file = fs.readFileSync(`../json/J${i}.json`);
      const parsed = JSON.parse(file);
      parsed.messages.forEach((message) => {
        if (message[0]['author']['username'] === 'MidJourney Bot') {
          if (message[0]['attachments'][0]) {
            if (message[0]['attachments'][0]['url']) {
              let prompt = message[0]['content'];
              prompt = prompt.replace(/[*|,]/g, '');
              prompt = prompt.split(' ');
              let size = message[0]['attachments'][0]['size'];
              let height = message[0]['attachments'][0]['height'];
              let width = message[0]['attachments'][0]['width'];
              let url = message[0]['attachments'][0]['url'];
              let imageID = j;
              const newObj = { url, prompt, size, height, width, imageID };
              URLArray.push(newObj);
              j++;
              console.log('Pushing Image' + j);
            }
          }
        }
      });
    }
    res.locals.URLArray = URLArray;
    return next();
  }
}

const initialImageController = new InitialImageController();

module.exports = initialImageController;
