"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import LoaderTextIcon from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Home: React.FC = () => {
  const router = useRouter();

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setVideoFile(file);
    setPreviewUrl(URL.createObjectURL(file)); // Generate preview URL
  }, []);

  const handleUpload = async () => {
    if (!videoFile) return;
    setIsUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", videoFile);
      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const { data } = response;
      router.push(`/studio/${data.newName}`);
      toast.success("Video uploaded successfully");
    } catch (error: any) {
      setUploadError(error.message || "Failed to upload video.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setVideoFile(null);
    setPreviewUrl(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: !!previewUrl,
    noKeyboard: !!previewUrl,
    accept: { "video/*": [] },
  });

  return (
    <main className="flex flex-col items-center p-4 sm:p-6 lg:p-8 min-h-screen mt-20">
      <div className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium mb-5 sm:mb-8 lg:mb-10">
        Echoes across cultures.
        <br />
        AI-Enhanced Multilingual Video Subtitles
      </div>
      <div className="flex flex-col justify-center items-center w-full sm:w-3/4 lg:w-2/3">
        <Alert className="bg-primary/60 text-white mb-4">
          <AlertTitle>Hey Pal !!!</AlertTitle>
          <AlertDescription>
            Use short video{" "}
            <span className="font-bold">(2min max / less than 2mb)</span> files
            for better performance.
          </AlertDescription>
        </Alert>
        <div
          {...getRootProps()}
          className="text-xl bg-primary/10 border-2 border-dashed border-muted-foreground rounded-lg p-4 sm:p-6 lg:p-10 text-center w-full h-[300px] sm:h-[400px] lg:h-[500px] flex flex-col justify-center items-center overflow-hidden"
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <LoaderTextIcon text="Uploading ..." />
          ) : previewUrl ? (
            <>
              <video
                src={previewUrl}
                className="max-h-full max-w-full rounded-lg shadow-md mb-4"
                controls
              />
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button size={"lg"} onClick={handleUpload}>
                  Upload Video
                </Button>
                <Button size={"lg"} variant="outline" onClick={handleRemove}>
                  Remove Video
                </Button>
              </div>
            </>
          ) : isDragActive ? (
            <p>Drop the video here ...</p>
          ) : (
            <p>Drag & drop a video here, or click to select a video</p>
          )}
          {uploadError && (
            <p className="text-red-500 text-sm mt-2">{uploadError}</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
