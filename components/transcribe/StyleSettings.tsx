import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface StyleSettingsProps {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  secondaryColor: string;
  setSecondaryColor: (color: string) => void;
  outlineColor: string;
  setOutlineColor: (color: string) => void;
  backColor: string;
  setBackColor: (color: string) => void;
  underline: number;
  setUnderline: (underline: number) => void;
  strikeout: number;
  setStrikeout: (strikeout: number) => void;
}

const StyleSettings: React.FC<StyleSettingsProps> = ({
  primaryColor,
  setPrimaryColor,
  secondaryColor,
  setSecondaryColor,
  outlineColor,
  setOutlineColor,
  backColor,
  setBackColor,
  underline,
  setUnderline,
  strikeout,
  setStrikeout,
}) => {
  const handleToggle = (
    setter: (value: number) => void,
    currentValue: number,
  ) => {
    setter(currentValue === -1 ? 0 : -1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Style</CardTitle>
        <CardDescription>
          Customize the appearance of your subtitles here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          Primary Color:
          <input
            type="color"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
          />
        </div>
        <div>
          Secondary Color:
          <input
            type="color"
            value={secondaryColor}
            onChange={(e) => setSecondaryColor(e.target.value)}
          />
        </div>
        <div>
          Outline Color:
          <input
            type="color"
            value={outlineColor}
            onChange={(e) => setOutlineColor(e.target.value)}
          />
        </div>
        <div>
          Back Color:
          <input
            type="color"
            value={backColor}
            onChange={(e) => setBackColor(e.target.value)}
          />
        </div>
        <div>
          Underline:
          <Switch onClick={() => handleToggle(setUnderline, underline)}>
            {underline === -1 ? "Underlined" : "Not Underlined"}
          </Switch>
        </div>
        <div>
          Strikeout:
          <Switch onClick={() => handleToggle(setStrikeout, strikeout)}>
            {strikeout === -1 ? "Strikeout" : "No Strikeout"}
          </Switch>
        </div>
      </CardContent>
    </Card>
  );
};

export default StyleSettings;
