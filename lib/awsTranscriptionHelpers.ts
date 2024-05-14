interface Alternative {
  confidence: string;
  content: string;
}

interface TranscriptionItem {
  type: string;
  alternatives: Alternative[];
  start_time?: string;
  end_time?: string;
}

export interface SRTItem {
  start_time: string;
  end_time: string;
  content: string;
}

// Function to clear transcription items and merge contents without start_time
export function clearTranscriptionItems(items: TranscriptionItem[]): SRTItem[] {
  items.forEach((item, index) => {
    if (!item.start_time && index > 0) {
      const prev = items[index - 1];
      if (prev) {
        prev.alternatives[0].content += item.alternatives[0].content;
        delete items[index];
      }
    }
  });
  return items
    .filter((item) => item.start_time)
    .map((item) => ({
      start_time: item.start_time!,
      end_time: item.end_time!,
      content: item.alternatives[0].content,
    }));
}

// Function to convert seconds to HH:MM:SS,MS
function secondsToHHMMSSMS(timeString: string): string {
  const d = new Date(parseFloat(timeString) * 1000);
  return d.toISOString().slice(11, 23).replace(".", ",");
}

// Function to convert transcription items to SRT format
export function transcriptionItemsToSrt(
  items: SRTItem[],
  yorubaContentItems?: string[],
): string {
  let srt = "";
  let i = 1;
  items.forEach((item, index) => {
    const content =
      yorubaContentItems && yorubaContentItems[index]
        ? yorubaContentItems[index]
        : item.content;

    srt += `${i}\n`;
    srt += `${secondsToHHMMSSMS(item.start_time)} --> ${secondsToHHMMSSMS(item.end_time)}\n`;
    srt += `${content}\n\n`;
    i++;
  });
  return srt;
}
