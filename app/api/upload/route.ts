import { NextResponse } from "next/server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import uniqid from "uniqid";
export async function POST(req: any) {
  const formData = await req.formData();
  const file = formData.get("file");
  const { name, type } = file;
  const data = await file.arrayBuffer();
  // @ts-ignore
  const s3client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const id = uniqid();
  const ext = name.split(".").pop();
  const newName = id + "." + ext;
  const uploadCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: newName,
    Body: data,
    ACL: "public-read",
    ContentType: type,
  });

  await s3client.send(uploadCommand);
  return NextResponse.json({ message: "File uploaded", name, newName, type });
}
