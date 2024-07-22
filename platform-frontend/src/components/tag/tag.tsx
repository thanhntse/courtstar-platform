import React from "react";
import { TagProps } from ".";

const Tag: React.FC<TagProps> = ( props ) => {
  return (
    <div className={`${props.className} ${props.bgColor} ${props.txtColor} w-fit text-xs px-1 py-0.5 absolute font-semibold`}>
      <div>{props.label}</div>
    </div>
  );
}

export default Tag;
