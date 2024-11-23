"use server";
import { S3 } from "@aws-sdk/client-s3";
import { env } from "~/env";

const s3 = new S3({
  region: "ap-northeast-1",
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function generateUUID() {
  return new Promise<string>((resolve) => {
    const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );
    resolve(uuid);
  });
}

export async function uploadS3(file: Buffer, uuid: string, type: string) {
  if (uuid) {
    await s3
      .putObject({
        Bucket: "yard-sale",
        Key: uuid,
        Body: Buffer.from(file),
        ContentType: type,
      })
  } else {
    console.log("No UUID");
  }
}
