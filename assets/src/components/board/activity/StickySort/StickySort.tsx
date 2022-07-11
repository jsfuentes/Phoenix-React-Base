import React from "react";
import ActivityHeader from "src/components/board/activity/ActivityHeader";
import QuoteApp from "src/components/board/activity/StickySort/Woke";
import StickyNoteInput from "src/components/board/StickyNoteInput";

interface StickySortProps {}

export default function StickySort(props: StickySortProps) {
  return (
    <div className={"flex flex-col w-full h-full"}>
      <ActivityHeader
        title="1. Generate a quote"
        description="have a holly jolly christmas"
      />
      <div className={"flex-1 min-h-0 flex"}>
        <QuoteApp className="flex-1 min-w-0 h-full overflow-auto p-10" />
        {/*<div className="flex-1">nuts</div>*/}
        <div className="w-60 flex-none bg-gray-100 h-full flex flex-col">
          <div className="p-4 bg-white text-gray-600">
            <span>Uncategorized </span>
            <span className={"text-gray-400"}>4</span>
          </div>
        </div>
        <StickyNoteInput />
      </div>
    </div>
  );
}
