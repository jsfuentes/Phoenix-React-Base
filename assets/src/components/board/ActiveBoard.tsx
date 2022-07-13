import classNames from "classnames";
import React, { useContext } from "react";
import Crazy8Activity from "src/components/board/activity/Crazy8Activity";
import StickySort from "src/components/board/activity/StickySort";
import VoteActivity from "src/components/board/activity/VoteActivity";
import VoteResultsActivity from "src/components/board/activity/VoteResultsActivity";
import StickyNoteInput from "src/components/board/StickyNoteInput";
import TempBoardContext from "src/contexts/TempBoardContext";

interface ActiveBoardProps {
  className?: string;
}

export default function ActiveBoard(props: ActiveBoardProps) {
  const { user_id, activities, current_activity } =
    useContext(TempBoardContext);

  let activity = <></>;
  switch (current_activity?.type) {
    case "crazy8":
      activity = <Crazy8Activity />;
      break;
    case "theme_sort":
      activity = <StickySort />;
      break;
    case "upvote":
      activity = <VoteActivity />;
      break;
    case "vote_results":
      activity = <VoteResultsActivity />;
      break;
    default:
      activity = <></>;
      break;
  }

  return (
    <>
      {current_activity && (
        <div
          className={classNames({
            [props.className || ""]: props.className,
            "flex flex-col bg-gray-50 overflow-hidden": true,
          })}
        >
          {activity}
        </div>
      )}
    </>
  );
}
