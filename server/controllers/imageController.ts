import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import mysql from 'mysql';
import util from 'util';
import { z } from 'zod';
import uploadImageToBucket from '../models/imageStorageModel';

dotenv.config();

interface ImageController {
  /**
   * Inteface for middlewhare that handles image upload and retrieval
   * @typedef {Object} ImageController
   * 
   * @property {Function} saveImageToSQL - Uploads the image to the S3 bucket using uploadImageToBucket(), which returns a URL. Updates the mySQL table with the URL from #1.
   * @property {Function} getImageFromSQL - Retrieves all images from the mySQL database.
   * @property {Function} getSearchFromSQL - Retrieves all images from the mySQL database that match the search term.
   */
  saveImageToSQL: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  getImageFromSQL: (req: Request, res: Response, next: NextFunction) => void;
  getSearchFromSQL: (req: Request, res: Response, next: NextFunction) => void;
}


// Creates a connection to the AWS-RDS mySQL database using the credentials stored in the .env file.
// const con = mysql.createConnection({
//   host: process.env.AWS_ENDPOINT,
//   user: process.env.AWS_USER,
//   password: process.env.AWS_PASSWORD,
//   database: 'main'
// });


const imageController : ImageController = {
  /**
    Function does two things:
    1. Uploads the image to the S3 bucket using uploadImageToBucket(), which returns a URL.
    2. Updates the mySQL table with the URL from #1.

    @param req.img: Blob of the image to be uploaded.
    @param req.prompt: Prompt for the image.
    @param req.keyword: Keyword for the image.

    @return: void
  */
  saveImageToSQL: async (req, res, next) => {
    const { img, prompt, keyword } = req.body;

    // Validate the request body with zod.
    const schema = z.object({
      img: z.string(),
      prompt: z.string(),
      keyword: z.string()
    })

    const validated = schema.safeParse(req.body)

    if (!validated.success) {
      return next({
        log: 'Need an image, prompt, AND a keyword to upload.',
        message: validated.error
      })
    }

    const con = mysql.createConnection({
      host: process.env.AWS_ENDPOINT,
      user: process.env.AWS_USER,
      password: process.env.AWS_PASSWORD,
      database: 'main'
    });

    // Upload the image to S3 bucket. Will recieve URL to store in mySQL.
    // I'M ASSUMING THE BLOB IS IN THE REQ.BODY AS "IMG" PROPERTY.
    let amazonURL : string;

    try {
      amazonURL = await uploadImageToBucket(img);

      // Amazon upload successful but still no URL? Something went wrong.
      if (!amazonURL) {
        return next('Amazon upload failed.');
      }
    } 
    catch (e) {
      // If the upload to S3 fails return the error.
      return next(e);
    }

    // The newly inserted image ID is required for the join table.
    let newImageId : string;

    // See https://stackoverflow.com/questions/44004418/node-js-async-await-using-with-mysql
    const query = util.promisify(con.query).bind(con);

    // Insert a new record for the Images table into the mySQL db.
    const queryStringImagesTable = 'INSERT INTO images (url, prompt) VALUES (?, ?);';
    const queryParametersImagesTable = [amazonURL, prompt];

    try {
      newImageId = await query(
        queryStringImagesTable,
        queryParametersImagesTable
      );
    } catch (e) {
      return next(e);
    }

    // Insert a new record for the Keywords table into the mySQL db, if it doesn't already exist in the table.
    const queryStringKeywordsTable = 'INSERT INTO keywords (keyword) VALUES (?)';
    const queryParametersKeywordsTable = [amazonURL, keyword];

    // This looks weird, but it works. You WILL get an error if the keyword already exists, but that's fine.
    // Ideally, you'd do some real error handling to make sure it's not an issue with the database.
    try {
      const result = await query(
        queryStringKeywordsTable, 
        queryParametersKeywordsTable
      );

      newImageId = result.insertId;
    } catch { }

    // Insert a new record for the images_keywords table into the mySQL db.
    const queryStringImagesKeywordsTable = 'INSERT INTO images_keywords (image_id, keyword_id) VALUES (?, ?)';
    const queryParametersImagesKeywordsTable = [newImageId.insertId, keyword];

    con.query(
      queryStringImagesKeywordsTable,
      queryParametersImagesKeywordsTable,
      (err, result, fields) => {
        if (err) {
          return next(err);
        }
      }
    );
    return next();
  },

  /*
    Will get the most recent 16 images from the mySQL database.
    @param req.query.pg - the page number to get images from.
    @return res.locals.urls - an array of URLs to send back to the client.
  */

  getImageFromSQL: (req, res, next) => {
    const con = mysql.createConnection({
      host: process.env.AWS_ENDPOINT,
      user: process.env.AWS_USER,
      password: process.env.AWS_PASSWORD,
      database: 'main'
    });

    const { pg } = req.query;
    if (!pg) return next('Need a page number to get images from SQL.');

    // from the images table, we select for the most recent urls, accounting for pg number received from frontend.
    con.connect(function (err) {
      const queryString = 'SELECT url FROM images ORDER BY id DESC LIMIT 16 OFFSET ?';
      const specificImageStartValue = +pg * 16 - 16;
      const queryParameters = [specificImageStartValue];

      con.query(queryString, queryParameters, (err, result, fields) => {
        if (err) return next({ err });
        const urlArray = result.map((image) => image.url);
        res.locals.urls = urlArray;
        return next();
      });
      if (err) return next(err);
    });
  },
  getSearchFromSQL: (req, res, next) => {
    const { keyword } = req.query;
    const { pg } = req.query;

    if (!keyword || !pg) { return next('Need a keyword and page number to get images from SQL.'); }

    const con = mysql.createConnection({
      host: process.env.AWS_ENDPOINT,
      user: process.env.AWS_USER,
      password: process.env.AWS_PASSWORD,
      database: 'main'
    });

    // using the images_keywords join table, we select for the most recent urls according to a keyword, accounting for pg number received from frontend.
    con.connect(function (err) {
      const queryString = `SELECT url FROM images 
    INNER JOIN images_keywords ON images.id = images_keywords.image_id 
    INNER JOIN keywords ON images_keywords.keyword_id = keywords.keyword
    WHERE keywords.keyword = ?
    ORDER BY images.id DESC
    LIMIT 16 OFFSET ?`;

      const specificImageStartValue = pg * 16 - 16;
      const queryParameters = [keyword, specificImageStartValue];

      con.query(queryString, queryParameters, (err, result, fields) => {
        if (err) return next({ err });

        const urlArray = result.map((image) => image.url);
        res.locals.urls = urlArray;
        return next();
      });
      if (err) return next({ e });
    });
  }
}


imageController.saveImageToSQL = 
// Get 16 images (paginated) from the SQL database sorted by most recent.
imageController.;

// Get 16 (paginated) images based on a given query string.
imageController.getSearchFromSQL = ;

module.exports = imageController;
