import React from "react";
import { toast } from "react-toastify";
import { getStickyColor } from "src/components/board/activity/stickyColors";

interface VoteResultProps {
  activityGroup: ActivityGroup;
  sticky: Sticky;
  color: string;
}
//navigator.clipboard.writeText
export default function VoteResult(props: VoteResultProps) {
  function copyStickyToClipboard() {
    toast("Copied to clipboard", {
      toastId: "copy-sticky-to-clipboard",
      autoClose: 1500,
      hideProgressBar: true,
    });
    navigator.clipboard.writeText(props.sticky.text);
  }

  return (
    <div className="border border-gray-100 bg-white flex rounded-md mb-3 gap-3">
      <div className="flex flex-col cursor-not-allowed items-center px-5 py-3">
        <div className="flex justify-center items-center">
          <i className="bx bx-up-arrow" />
        </div>
        <div>5</div>
      </div>
      <div className="flex flex-col flex-1 py-2 gap-2">
        <div className="flex-1">{props.sticky.text}</div>
        <div
          className={`self-start bg-${props.color}-200 inline-block rounded-2xl py-1 px-3 font-medium text-${props.color}-800`}
        >
          {props.activityGroup.title}
        </div>
      </div>
      <div
        className="flex bg-gray-100 px-4 justify-center items-center text-gray-400 gap-1 cursor-pointer"
        onClick={copyStickyToClipboard}
      >
        <i className="bx bx-copy" />
        <div>Copy</div>
      </div>
    </div>
  );
}
