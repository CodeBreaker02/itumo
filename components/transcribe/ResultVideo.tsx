import React, { useEffect, useState, useRef } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL, fetchFile } from "@ffmpeg/util";
import { transcriptionItemsToSrt } from "@/lib/awsTranscriptionHelpers";
// @ts-ignore
import roboto from "../../fonts/Roboto.ttf";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface TranscriptionItem {
  start_time: string;
  end_time: string;
  content: string;
}

interface ResultVideoProps {
  filename: string;
  primaryColor: string;
  outlineColor: string;
  secondaryColor: string;
  backColor: string;
  underline: number;
  strikeout: number;
  transcriptionItems: TranscriptionItem[];
  yorubaContentItems?: string[];
}

export default function ResultVideo({
  filename,
  primaryColor,
  outlineColor,
  secondaryColor,
  backColor,
  underline,
  strikeout,
  transcriptionItems,
  yorubaContentItems,
}: ResultVideoProps) {
  const videoUrl = `${process.env.NEXT_PUBLIC_AWS_S3_BASE_URL}/${filename}`;
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState<number>(1);
  const ffmpegRef = useRef<FFmpeg>(new FFmpeg());
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = videoUrl;
      console.log(load());
    }
  }, []);

  const load = async () => {
    const ffmpeg = ffmpegRef.current;
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd";
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm",
      ),
    });
    await ffmpeg.writeFile("/tmp/roboto.ttf", await fetchFile(roboto));
    setLoaded(true);
  };

  function toFFmpegColor(rgb: string): string {
    const bgr = rgb.slice(5, 7) + rgb.slice(3, 5) + rgb.slice(1, 3);
    return `&H${bgr}&`;
  }

  const transcode = async () => {
    try {
      const ffmpeg = ffmpegRef.current;
      const srt = transcriptionItemsToSrt(
        transcriptionItems,
        yorubaContentItems,
      );
      await ffmpeg.writeFile(filename, await fetchFile(videoUrl));
      await ffmpeg.writeFile("subs.srt", srt);

      if (videoRef.current) {
        videoRef.current.src = videoUrl;
        await new Promise((resolve, reject) => {
          videoRef.current!.onloadedmetadata = resolve;
          videoRef.current!.onerror = reject; // Handle media loading errors
        });
        const duration = videoRef.current.duration;
        ffmpeg.on("log", ({ message }) => {
          const regexResult = /time=([0-9:.]+)/.exec(message);
          if (regexResult && regexResult[1]) {
            const [hours, minutes, seconds] = regexResult[1]
              .split(":")
              .map(Number);
            const doneTotalSeconds = hours * 3600 + minutes * 60 + seconds;
            const videoProgress = doneTotalSeconds / duration;
            setProgress(videoProgress);
          }
        });
        await ffmpeg.exec([
          "-i",
          filename,
          "-preset",
          "ultrafast",
          "-vf",
          `subtitles=subs.srt:fontsdir=/tmp:force_style='Fontname=Roboto,FontSize=25,MarginV=70,PrimaryColour=${toFFmpegColor(primaryColor)},SecondaryColour=${toFFmpegColor(secondaryColor)},OutlineColour=${toFFmpegColor(outlineColor)},BackColour=${toFFmpegColor(primaryColor)},Underline=${underline},StrikeOut=${strikeout}'`,
          "output.mp4",
        ]);
        const data = await ffmpeg.readFile("output.mp4");
        const buffer = (data as Uint8Array).buffer;
        videoRef.current.src = URL.createObjectURL(
          new Blob([buffer], { type: "video/mp4" }),
        );
        setProgress(1);
      }
    } catch (error) {
      console.error("Error during video transcoding:", error);
      // Handle or log the error appropriately
    }
  };

  return (
    <div className="flex flex-col w-full items-center px-4 md:px-24">
      <div className="rounded-xl overflow-hidden relative">
        {progress && progress < 1 && (
          <div className="absolute inset-0 bg-black/80 flex items-center">
            <div className="w-full text-center">
              <div className="bg-bg-gradient-from/50 mx-8 rounded-lg overflow-hidden relative">
                <div
                  className="bg-bg-gradient-from h-8"
                  style={{ width: progress * 100 + "%" }}
                >
                  <h3 className="text-white text-xl absolute inset-0 py-1">
                    {parseInt((progress * 100).toString())}%
                    <Progress
                      value={progress * 100}
                      className="bg-red-600 w-full h-full"
                    />
                  </h3>
                </div>
              </div>
            </div>
          </div>
        )}
        <video
          data-video={0}
          ref={videoRef}
          controls
          className="w-full h-auto"
        ></video>
      </div>
      <footer className="fixed bottom-0 left-0 z-20 w-full shadow shadow-gray-500 flex items-center justify-center p-6 bg-background">
        <Button onClick={transcode}>Apply captions</Button>
      </footer>
    </div>
  );
}
