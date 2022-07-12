import React, { useContext, useMemo, useState } from "react";
import ActivityHeader from "src/components/board/activity/ActivityHeader";
import CompletedStickies from "src/components/board/activity/Crazy8Activity/CompletedStickies";
import StickyNoteInput from "src/components/board/StickyNoteInput";
import TempBoardContext from "src/contexts/TempBoardContext";

interface Crazy8ActivityProps {}

export default function Crazy8Activity(props: Crazy8ActivityProps) {
  const { user_id, activities, current_activity, stickyIdToSticky } =
    useContext(TempBoardContext);

  const [selectedUser, setSelectedUser] = useState<number>(user_id);

  if (!current_activity) {
    return <></>;
  }

  const tabbedOptions = useMemo(() => {
    return current_activity.activity_groups
      .filter((group) => group.user_id != null)
      .map((group) => ({
        key: group.user_id as number, // as number to eliminate null user_id for compiler which cant see that we just filtered
        value: `User ${group.user_id}`,
      }));
  }, []); // TODO add eslint and fix this

  const selectedUserActivityGroup = useMemo(() => {
    return current_activity.activity_groups.find((activity) => {
      return activity.user_id === selectedUser;
    });
  }, [selectedUser]); //TODO

  return (
    <>
      <>
        <ActivityHeader
          title={current_activity.title}
          description={current_activity.description}
          tabbedOptions={tabbedOptions}
          selectedTabbedOption={selectedUser}
          onSelectTabbedOption={(selectedUser) => {
            setSelectedUser(selectedUser);
          }}
        />

        {selectedUserActivityGroup && (
          <div className={"flex gap-4 p-6 flex-1 overflow-x-auto min-w-0"}>
            {selectedUser === user_id && (
              <StickyNoteInput fullRounding={true} />
            )}
            <CompletedStickies
              stickyIdToSticky={stickyIdToSticky}
              selectedUserActivityGroup={selectedUserActivityGroup}
            />
          </div>
        )}
      </>
    </>
  );
}
