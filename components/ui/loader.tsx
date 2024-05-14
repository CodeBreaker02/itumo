import React from "react";
import { Loader } from "lucide-react";

interface LoaderTextIconProps {
  text: string;
}

const LoaderTextIcon: React.FC<LoaderTextIconProps> = ({ text }) => {
  return (
    <div className="w-full flex justify-center items-center font-semibold text-xl ">
      <Loader className="animate-spin h-5 w-5 mr-3" />
      {text}
    </div>
  );
};

export default LoaderTextIcon;
