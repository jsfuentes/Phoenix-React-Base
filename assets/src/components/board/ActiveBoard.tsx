import classNames from "classnames";
import React, { useContext } from "react";
import StickySort from "src/components/board/activity/StickySort";
import StickyNoteInput from "src/components/board/StickyNoteInput";
import TempBoardContext from "src/contexts/TempBoardContext";

interface ActiveBoardProps {
  className?: string;
}

export default function ActiveBoard(props: ActiveBoardProps) {
  return (
    <div
      className={classNames({
        [props.className || ""]: props.className,
        "bg-gray-50 overflow-hidden": true,
      })}
    >
      <StickySort />
    </div>
  );
}
