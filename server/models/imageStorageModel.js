const AWS = require('aws-sdk');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

require('dotenv').config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
});

//NOTE: May not use readFileSync if a blob is given to us.
const uploadFile = (fileName) => {
  // Read content from the file
  let fileContent;
  try {
    fileContent = fs.readFileSync(fileName);
  } catch (e) {
    throw e;
  }
  // Setting up S3 upload parameters
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `${uuidv4()}.jpg`, // File name you want to save as in S3 -- maybe a randomly generated key.
    Body: fileContent
  };

  // Uploading files to the bucket. Return the URL.
  let awsReturnedURL;
  //Will need to catch errors here and pass to global error handler.
  s3.upload(params, function (err, data) {
    if (err) {
      throw err;
    } else awsReturnedURL = data.Location;
  });
  return awsReturnedURL;
};

module.exports = uploadFile;
