import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TranscriptionItemProps {
  start_time: string;
  end_time: string;
  content: string;
  yorubaContent?: string;
}

interface TranscriptionItemComponentProps {
  item: TranscriptionItemProps;
  handleStartTimeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleEndTimeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleContentChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleYorubaContentChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
}

export default function TranscriptionItem({
  item,
  handleStartTimeChange,
  handleEndTimeChange,
  handleContentChange,
  handleYorubaContentChange,
}: TranscriptionItemComponentProps) {
  return (
    <Table className="min-w-full divide-y divide-gray-200">
      <TableHeader>
        <TableRow>
          <TableHead>StartTime</TableHead>
          <TableHead>EndTime</TableHead>
          <TableHead>Content</TableHead>
          <TableHead>Yoruba Content</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>
            <input
              type="text"
              className="bg-white/20 p-1 rounded-md w-full"
              value={item.start_time}
              onChange={handleStartTimeChange}
            />
          </TableCell>
          <TableCell>
            <input
              type="text"
              className="bg-white/20 p-1 rounded-md w-full"
              value={item.end_time}
              onChange={handleEndTimeChange}
            />
          </TableCell>
          <TableCell>
            <input
              type="text"
              className="bg-white/20 p-1 rounded-md w-full"
              value={item.content}
              onChange={handleContentChange}
            />
          </TableCell>
          <TableCell>
            <input
              type="text"
              className="bg-white/20 p-1 rounded-md w-full"
              value={item.yorubaContent}
              onChange={handleYorubaContentChange}
              placeholder="Yoruba Translation"
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
