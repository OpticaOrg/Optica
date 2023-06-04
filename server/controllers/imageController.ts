import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import mysql from 'mysql';
import util from 'util';
import { z } from 'zod';
import uploadImageToBucket from '../models/imageStorageModel';

dotenv.config();

export interface ImageController {
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

interface SaveImgToSQLRequestBody extends Request {
  body: {
    img: string,
    prompt: string,
    keyword: string
  }
}



// set secrets in lowest scope and validate first
const validateAWSCredentials = z.object({
  AWS_ENDPOINT: z.string().nonempty(),
  AWS_USER: z.string().nonempty(),
  AWS_PASSWORD: z.string().nonempty(),
})

const { AWS_ENDPOINT, AWS_USER, AWS_PASSWORD } = validateAWSCredentials.parse(process.env)

const con = mysql.createConnection({
  host: AWS_ENDPOINT,
  user: AWS_USER,
  password: AWS_PASSWORD,
  database: 'main'
});

/**
 * This is a helper function that takes a SQL query and parameters and returns an array of image URLs. I saw that yall been calling this function in the imageController, so I moved it here to keep it DRY.
 * 
 * @param sqlQuery: SQL query to be executed. Make sure the query ends with "LIMIT ?, 10" so that the function can add the specificImageStartValue to the end of the query.
 * @param queryParameters: The parameters for the SQL query.
 * @param specificImageStartValue: The value to be added to the end of the query.
 * @param callback: The callback function to be executed after the query is executed. It will use error and result parameters in that order. 
 */

const sqlImageQuery = <T>(
  sqlQuery: string,
  queryParameters: T[] | null = null,
  specificImageStartValue: number,
  callback: (err: Error | null, result: string[] | null) => void
) => {
  con.connect(function (err) {
    if (err) {
      return callback(err, null);
    }

    type Image = { url: string; };

    con.query(sqlQuery, queryParameters ? [...queryParameters, specificImageStartValue] : [specificImageStartValue], (err, result: Image[], fields?) => {
      if (err) {
        return callback(err, null);
      }

      const urlArray: string[] = result.map((image) => image.url);
      callback(null, urlArray);
    });
  });
};


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
  saveImageToSQL: async (req: SaveImgToSQLRequestBody, res, next) => {
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

    // Upload the image to S3 bucket. Will recieve URL to store in mySQL.
    // I'M ASSUMING THE BLOB IS IN THE REQ.BODY AS "IMG" PROPERTY.
    let awsURL : string;

    try {
      awsURL = await uploadImageToBucket(img);

      // Amazon upload successful but still no URL? Something went wrong.
      if (!awsURL) {
        return next('Amazon upload failed.');
      }
    } 
    catch (err) {
      // If the upload to S3 fails return the error.
      return next(err);
    }

    // The newly inserted image ID is required for the join table.
    // See https://stackoverflow.com/questions/44004418/node-js-async-await-using-with-mysql
    let newImageId : string;

    const query: (sql: string, sqlQueryParams: string[]) => Promise<any> = util.promisify(con.query).bind(con);

    // Insert a new record for the Images table into the mySQL db.
    const queryStringImagesTable = 'INSERT INTO images (url, prompt) VALUES (?, ?);';
    const queryParametersImagesTable = [awsURL, prompt];

    try {
      const result : any = await query(
        queryStringImagesTable,
        queryParametersImagesTable
      );
      newImageId = result.insertId;
    } catch (e) {
      return next(e);
    }

    // Insert a new record for the Keywords table into the mySQL db, if it doesn't already exist in the table.
    const queryStringKeywordsTable = 'INSERT INTO keywords (keyword) VALUES (?)';
    const queryParametersKeywordsTable = [awsURL, keyword];

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
    const queryParametersImagesKeywordsTable = [newImageId, keyword];

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

  /**
   * getImageFromSQL() will get the most recent 16 images from the mySQL database.
   * 
   * @param req.query.pg: The page number to get images from. 
   * @param res.locals.urls: The array of URLs to be sent back to the frontend.
   * @param next: The next middleware function. 
   * @returns: void
   */

  getImageFromSQL: (req, res, next) => {

    const schema = z.object({
      pg: z.number()
    })

    const { pg } = schema.parse(req.query)

    if (pg === undefined) {
      return next('Need a page number to get images from SQL.');
    }

    // from the images table, we select for the most recent urls, accounting for pg number received from frontend.

    const queryString = 'SELECT url FROM images ORDER BY id DESC LIMIT 16 OFFSET ?';
    const specificImageStartValue = +pg * 16 - 16;

    sqlImageQuery(queryString, null, specificImageStartValue, (err, urlArray) => {
      if (err) {
        return next(err);
      }

      res.locals.urls = urlArray;
      return next();
    });

  },

  /**
   * getSearchFromSQL() will get the most recent 16 images from the mySQL database that match the keyword.
   * 
   * @param req.query.keyword: Getting the keyword from a query string.
   * @param res.locals.urls: An array of URLs to send back to the client.
   * @param next: Passes control to the next middleware function.
   * @returns: void
   */
  getSearchFromSQL: (req, res, next) => {
    // Validate the request body with zod.
    const schema = z.object({
      keyword: z.string(),
      pg: z.number()
    })

    let keyword : string, pg : number;

    try {
      ({ keyword, pg } = schema.parse(req.query));
    }
    catch (err) {
      return next({
        log: 'Need a keyword and page number to get images from SQL.',
        message: err
      });
    }

    // using the images_keywords join table, we select for the most recent urls according to a keyword, accounting for pg number received from frontend.


    const queryString = `SELECT url FROM images 
    INNER JOIN images_keywords ON images.id = images_keywords.image_id 
    INNER JOIN keywords ON images_keywords.keyword_id = keywords.keyword
    WHERE keywords.keyword = ?
    ORDER BY images.id DESC
    LIMIT 16 OFFSET ?`;
    const queryParameters = [keyword];
    const specificImageStartValue = pg * 16 - 16;

    sqlImageQuery(queryString, queryParameters, specificImageStartValue, (err, urlArray) => {
      if (err) {
        return next({
          log: 'Error in getSearchFromSQL.',
          message: err
        });
      }

      res.locals.urls = urlArray;
      return next();
    })
  }
}

export default imageController;
