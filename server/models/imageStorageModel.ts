import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
dotenv.config();

// Validate environment variables with zod.
const envVarsSchema = z.object({
  AWS_S3_ACCESS_KEY_ID: z.string().nonempty(),
  AWS_S3_SECRET_ACCESS_KEY: z.string().nonempty(),
  BUCKET_NAME: z.string().nonempty(),
  AWS_URL_STEM: z.string().nonempty()
});

const { AWS_S3_ACCESS_KEY_ID, AWS_S3_SECRET_ACCESS_KEY, BUCKET_NAME, AWS_URL_STEM } = envVarsSchema.parse(process.env);


// Uplaod the image blob to a specified S3 bucket.
const uploadFile = async (blob : string) => {
  // Read content from the file
  // NOTE: CURRENTLY EXPECTING THE BLOB, BUT WE CAN CHANGE THIS AS NECESSARY.
  // let fileContent;
  // try {
  //   fileContent = fs.readFileSync(fileName);
  // } catch (e) {
  //   throw e;
  // }


  // Setting up client connection to S3.
  const client = new S3Client({ 
    region: 'us-east-1',
    credentials: {
      accessKeyId: AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: AWS_S3_SECRET_ACCESS_KEY
    },
    endpoint: AWS_URL_STEM,
  });

  // Setting up S3 upload parameters
  const params = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    // File name you want to save as in S3 -- maybe a randomly generated key.
    Key: `${uuidv4()}.jpg`,
    // hehe blobs 
    Body: blob
  });

  // Uploading files to the bucket. Return the URL. See https://stackoverflow.com/questions/57420576/how-to-synchronously-upload-files-to-s3-using-aws-sdk.

  try {
    const result = await client.send(params);
    return await getSignedUrl(client, params, {
      expiresIn: 3600
    });
  }
  catch (e) {
    throw e;
  }
};

export default uploadFile;
