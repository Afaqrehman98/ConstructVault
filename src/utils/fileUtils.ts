import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "./s3Client";

const uploadFile = async (
  bucketName: string,
  key: string,
  body: Buffer
): Promise<void> => {
  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: body,
    });
    const data = await s3Client.send(command);
    console.log("File uploaded successfully", data);
  } catch (error) {
    console.error("Error uploading file", error);
    throw error; // Re-throw error to handle it in route/controller
  }
};

export { uploadFile };
