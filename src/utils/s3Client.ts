import { S3Client } from "@aws-sdk/client-s3";

// Create an S3 client instance
const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT || "http://localhost:8001",
  region: "eu-central-1",
  forcePathStyle: true, // Use path-style addressing
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || "mockAccessKeyId",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "mockSecretAccessKey",
  },
});
console.log("S3 Client Config:", s3Client.config);
export default s3Client;
