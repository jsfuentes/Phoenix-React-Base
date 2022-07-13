import React, { useContext } from "react";
import CompletedStickies from "src/components/board/activity/Crazy8Activity/CompletedStickies";
import Crazy8RightBar from "src/components/board/activity/Crazy8Activity/Crazy8RightBar";
import VoteGroups from "src/components/board/activity/VoteActivity/VoteGroups";
import VoteSidebar from "src/components/board/activity/VoteActivity/VoteSidebar";
import StickyNoteInput from "src/components/board/StickyNoteInput";
import TempBoardContext from "src/contexts/TempBoardContext";

interface VoteActivityProps {}

export default function VoteActivity(props: VoteActivityProps) {
  const { user_id, activities, current_activity, stickyIdToSticky } =
    useContext(TempBoardContext);

  return (
    <>
      {current_activity && (
        <div className={"flex  flex-1 overflow-x-auto min-w-0"}>
          <div className={"flex-1 flex gap-4 p-6"}>
            <VoteGroups
              activityGroups={current_activity.activity_groups}
              stickyIdToSticky={stickyIdToSticky}
            />
          </div>
          <VoteSidebar activity_groups={current_activity.activity_groups} />
        </div>
      )}
    </>
  );
}
