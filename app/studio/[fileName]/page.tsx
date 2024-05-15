"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  clearTranscriptionItems,
  SRTItem,
} from "@/lib/awsTranscriptionHelpers";
import TranscriptionEditor from "@/components/transcribe/TranscriptionEditor";
import ResultVideo from "@/components/transcribe/ResultVideo";
import LoaderTextIcon from "@/components/ui/loader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import StyleSettings from "@/components/transcribe/StyleSettings";
import { Loader } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Page({ params }: { params: { fileName: string } }) {
  const fileName = params.fileName;
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isFetchingInfo, setIsFetchingInfo] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false); // New state for translation process
  const [originalText, setOriginalText] = useState("");

  const [awsTranscriptionItems, setAwsTranscriptionItems] = useState<SRTItem[]>(
    [],
  );
  const [yorubaItems, setYorubaItems] = useState<string[]>([]);
  const [primaryColor, setPrimaryColor] = useState<string>("#FFFFFF");
  const [outlineColor, setOutlineColor] = useState<string>("#000000");
  const [secondaryColor, setSecondaryColor] = useState("#CCCCCC"); // Default grey
  const [backColor, setBackColor] = useState("#000000"); // Default black
  const [underline, setUnderline] = useState(0);
  const [strikeout, setStrikeout] = useState(0);
  const [wordCountDiff, setWordCountDiff] = useState(0);

  useEffect(() => {
    getTranscription();
  }, [fileName]);

  function getTranscription() {
    setIsFetchingInfo(true);
    axios
      .get(`/api/transcribe?fileName=${encodeURIComponent(fileName)}`)
      .then((response) => {
        setIsFetchingInfo(false);
        const status = response.data?.status;
        const transcription = response.data?.transcription;

        if (status === "IN_PROGRESS") {
          setIsTranscribing(true);
          setTimeout(getTranscription, 3000); // Recheck after 3 seconds
        } else {
          let transcriptionItems = transcription.results.items;
          setIsTranscribing(false);
          if (
            transcription &&
            transcription.results &&
            Array.isArray(transcriptionItems)
          ) {
            setAwsTranscriptionItems(
              clearTranscriptionItems(transcriptionItems),
            );
          } else {
            console.error("No transcription results available.", transcription);
            setAwsTranscriptionItems([]);
          }
        }
      })
      .catch((error) => {
        setIsFetchingInfo(false);
        setIsTranscribing(false);
        console.error("Error fetching transcription:", error);
      });
  }
  const translateToYoruba = async () => {
    setIsTranslating(true);
    const contentArray = awsTranscriptionItems
      .map((item) => item.content)
      .join(" ");
    setOriginalText(contentArray); // Store the original text for later display
    const formData = new FormData();
    formData.append("items", contentArray);
    const englishWordCount = contentArray.split(" ").length;

    try {
      const response = await axios.post("/api/translate", formData);
      const yorubaTranslation = response.data[0];
      const yorubaWords = yorubaTranslation
        .split(" ")
        .filter((word: string) => word.trim()).length;
      setYorubaItems(
        yorubaTranslation.split(" ").map((word: string) => word.trim()),
      );
      setWordCountDiff(yorubaWords - englishWordCount);
    } catch (error) {
      console.error("Error translating items:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  if (isTranscribing) {
    return (
      <div className="py-16 p-4 mt-20">
        <LoaderTextIcon text="Transcribing your video..." />
      </div>
    );
  }

  if (isFetchingInfo) {
    return (
      <div className="py-16 p-4 mt-20">
        <LoaderTextIcon text="Retrieving video data ..." />
      </div>
    );
  }

  return (
    <div className="py-20 md:px-10 my-10 md:my-20 flex flex-col-reverse md:flex-row justify-between">
      <Tabs defaultValue="captions" className="w-full mt-4 ">
        <TabsList className="grid grid-cols-1 md:grid-cols-2">
          <TabsTrigger value="captions">Captions</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
        </TabsList>
        <TabsContent value="captions">
          <Card>
            <CardHeader>
              <CardTitle>Captions and Translation</CardTitle>
              <CardDescription>
                Review and compare caption translations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex flex-col items-center">
              {!isTranslating && (
                <div className="text-center">
                  <h3 className="text-lg font-semibold">
                    Word Count Difference: {wordCountDiff}
                  </h3>
                  {wordCountDiff !== 0 && (
                    <p className="text-sm text-red-500">
                      {wordCountDiff > 0 ? "More" : "Fewer"} words in the Yoruba
                      translation.
                    </p>
                  )}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline">
                        View Translation Comparison
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Translation Comparison</SheetTitle>
                        <SheetClose />
                      </SheetHeader>
                      <SheetDescription>
                        Compare the original English text with the Yoruba
                        translation.
                      </SheetDescription>
                      <div className="flex flex-col space-y-4">
                        <div>
                          <h3 className="font-semibold">English (Original)</h3>
                          <p>{originalText}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold">Yoruba (Translated)</h3>
                          <p>{yorubaItems.join(" ")}</p>
                        </div>
                        <div className="text-center">
                          <h4 className="text-lg font-bold">
                            Word Count Difference: {wordCountDiff}
                          </h4>
                          <p
                            className={`text-sm ${wordCountDiff !== 0 ? "text-red-500" : "text-green-500"}`}
                          >
                            {wordCountDiff > 0
                              ? "More words in Yoruba"
                              : "Fewer words in Yoruba"}
                          </p>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              )}
              <TranscriptionEditor
                awsTranscriptionItems={awsTranscriptionItems}
                yorubaItems={yorubaItems}
                setAwsTranscriptionItems={setAwsTranscriptionItems}
                setYorubaItems={setYorubaItems}
              />
              <Button
                type="submit"
                variant="outline"
                onClick={translateToYoruba}
                className={`w-full mt-4 ${isTranslating ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={isTranslating}
              >
                {isTranslating ? (
                  <>
                    <Loader className="animate-spin h-5 w-5 mr-3" />
                    Translating ...
                  </>
                ) : (
                  "Translate to Yoruba"
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="style">
          <StyleSettings
            primaryColor={primaryColor}
            setPrimaryColor={setPrimaryColor}
            secondaryColor={secondaryColor}
            setSecondaryColor={setSecondaryColor}
            outlineColor={outlineColor}
            setOutlineColor={setOutlineColor}
            backColor={backColor}
            setBackColor={setBackColor}
            underline={underline}
            setUnderline={setUnderline}
            strikeout={strikeout}
            setStrikeout={setStrikeout}
          />
        </TabsContent>
      </Tabs>
      <ResultVideo
        filename={fileName}
        primaryColor={primaryColor}
        outlineColor={outlineColor}
        secondaryColor={secondaryColor}
        backColor={backColor}
        underline={underline}
        strikeout={strikeout}
        transcriptionItems={awsTranscriptionItems}
        yorubaContentItems={yorubaItems}
      />
    </div>
  );
}
