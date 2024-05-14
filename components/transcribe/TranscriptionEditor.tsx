import React from "react";
import TranscriptionItem from "@/components/transcribe/TranscriptionItem";
import { ScrollArea } from "../ui/scroll-area";

interface TranscriptionItemProps {
  start_time: string;
  end_time: string;
  content: string;
  yorubaContent?: string; // Optional Yoruba content
}

interface TranscriptionEditorProps {
  awsTranscriptionItems: TranscriptionItemProps[];
  setAwsTranscriptionItems: React.Dispatch<
    React.SetStateAction<TranscriptionItemProps[]>
  >;
  yorubaItems: string[];
  setYorubaItems: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function TranscriptionEditor({
  awsTranscriptionItems,
  setAwsTranscriptionItems,
  yorubaItems,
  setYorubaItems,
}: TranscriptionEditorProps) {
  function updateTranscriptionItem(
    index: number,
    prop: keyof TranscriptionItemProps,
    value: string,
  ) {
    const newItems = [...awsTranscriptionItems];
    newItems[index] = { ...newItems[index], [prop]: value };
    setAwsTranscriptionItems(newItems);
  }

  function updateYorubaItem(index: number, value: string) {
    const newYorubaItems = [...yorubaItems];
    newYorubaItems[index] = value;
    setYorubaItems(newYorubaItems);
  }

  return (
    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
      {awsTranscriptionItems.map((item, index) => (
        <TranscriptionItem
          key={index}
          item={{
            ...item,
            yorubaContent: yorubaItems[index] || "",
          }}
          handleStartTimeChange={(ev) =>
            updateTranscriptionItem(index, "start_time", ev.target.value)
          }
          handleEndTimeChange={(ev) =>
            updateTranscriptionItem(index, "end_time", ev.target.value)
          }
          handleContentChange={(ev) =>
            updateTranscriptionItem(index, "content", ev.target.value)
          }
          handleYorubaContentChange={(ev) =>
            updateYorubaItem(index, ev.target.value)
          }
        />
      ))}
    </ScrollArea>
  );
}
