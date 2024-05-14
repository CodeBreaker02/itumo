import { NextResponse } from "next/server";
import {
  GetTranscriptionJobCommand,
  StartTranscriptionJobCommand,
  TranscribeClient,
} from "@aws-sdk/client-transcribe";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

function getClient() {
  // @ts-ignore
  return new TranscribeClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
}

function createTranscriptionCommand(fileName: string | undefined) {
  if (!fileName) {
    throw new Error("No file name provided");
  }

  return new StartTranscriptionJobCommand({
    TranscriptionJobName: fileName,
    MediaFormat: "mp4",
    OutputKey: `${fileName}.transcription`,
    IdentifyLanguage: true,
    Media: {
      MediaFileUri: `s3://${process.env.AWS_BUCKET_NAME}/${fileName}`,
    },
    OutputBucketName: process.env.AWS_BUCKET_NAME,
  });
}

async function createTranscriptionJob(fileName: string | undefined) {
  const sdkClient = getClient();
  const transcriptionJob = createTranscriptionCommand(fileName);
  return await sdkClient.send(transcriptionJob);
}

async function getJob(fileName: string | undefined) {
  if (!fileName) {
    console.error("No fileName provided for transcription job status check.");
    return null; // Return null if no fileName is provided
  }

  const transcribeClient = getClient();
  try {
    const transcriptionJobStatusCommand = new GetTranscriptionJobCommand({
      TranscriptionJobName: fileName,
    });
    return await transcribeClient.send(transcriptionJobStatusCommand);
  } catch (e) {
    console.error("Error fetching job status with fileName", fileName, ":", e);
    return null; // Explicitly return null on error
  }
}

async function streamToString(stream: any): Promise<string> {
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk: Buffer) => chunks.push(Buffer.from(chunk)));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    stream.on("error", reject);
  });
}

async function getTranscriptionFile(fileName: string | undefined) {
  const transcriptionFile = fileName + ".transcription";
  // @ts-ignore
  const s3client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const getObjectCommand = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: transcriptionFile,
  });
  let transcriptionFileResponse = null;
  try {
    transcriptionFileResponse = await s3client.send(getObjectCommand);
  } catch (e) {
    console.error("Error fetching transcription file:", e);
  }
  if (transcriptionFileResponse) {
    return JSON.parse(await streamToString(transcriptionFileResponse.Body));
  }
  return null;
}

export async function GET(req: any) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.search);
  const fileName = searchParams.get("fileName") || undefined;
  const transcription = await getTranscriptionFile(fileName);
  if (transcription) {
    return NextResponse.json({
      status: "COMPLETED",
      transcription,
    });
  }

  const existingJob = await getJob(fileName);

  if (existingJob?.TranscriptionJob?.TranscriptionJobStatus) {
    return NextResponse.json({
      status: existingJob.TranscriptionJob.TranscriptionJobStatus,
    });
  }

  // If no existing job or job status is not retrievable, start a new job
  if (!existingJob) {
    const newJob = await createTranscriptionJob(fileName);
    if (!newJob?.TranscriptionJob?.TranscriptionJobStatus) {
      throw new Error("Failed to start transcription job");
    }
    return NextResponse.json({
      status: newJob.TranscriptionJob.TranscriptionJobStatus,
    });
  }

  return NextResponse.json(null);
}
