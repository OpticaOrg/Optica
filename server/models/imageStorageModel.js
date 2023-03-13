const AWS = require('aws-sdk');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

//Create a connection to the AWS S3 server.
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
});

//Uplaod the image blob to a specified S3 bucket.
const uploadFile = async (blob) => {
  // Read content from the file
  //NOTE: CURRENTLY EXPECTING THE BLOB, BUT WE CAN CHANGE THIS AS NECESSARY.
  // let fileContent;
  // try {
  //   fileContent = fs.readFileSync(fileName);
  // } catch (e) {
  //   throw e;
  // }
  // Setting up S3 upload parameters
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `${uuidv4()}.jpg`, // File name you want to save as in S3 -- maybe a randomly generated key.
    Body: blob
  };

  // Uploading files to the bucket. Return the URL. See https://stackoverflow.com/questions/57420576/how-to-synchronously-upload-files-to-s3-using-aws-sdk.
  let awsReturnedURL;
  //Will need to catch errors here and pass to global error handler.
  const stored = await s3
    .upload(params, function (err, data) {
      if (err) {
        throw err;
      }
    })
    .promise();
  awsReturnedURL = process.env.AWS_URL_STEM + stored.Key;
  return awsReturnedURL;
};

module.exports = uploadFile;
