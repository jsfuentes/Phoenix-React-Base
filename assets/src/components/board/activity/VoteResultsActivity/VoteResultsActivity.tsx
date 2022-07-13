import { useContext } from "react";
import VoteResultsList from "src/components/board/activity/VoteResultsActivity/VoteResultsList";
import VoteResultsSidebar from "src/components/board/activity/VoteResultsActivity/VoteResultsSidebar";
import TempBoardContext from "src/contexts/TempBoardContext";

interface VoteResultsProps {}

export default function VoteResultsActivity(props: VoteResultsProps) {
  const { user_id, activities, current_activity, stickyIdToSticky } =
    useContext(TempBoardContext);

  return (
    <>
      {current_activity && (
        <div className={"flex  flex-1 overflow-x-auto min-w-0"}>
          <div className={"flex-1 flex gap-4 p-6"}>
            <VoteResultsList
              stickyGroups={current_activity.activity_groups}
              stickyIdToSticky={stickyIdToSticky}
            />
          </div>
          <VoteResultsSidebar
            activity_groups={current_activity.activity_groups}
          />
        </div>
      )}
    </>
  );
}
