import classNames from "classnames";
import React, { useContext, useMemo } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import ActivityHeader from "src/components/board/activity/ActivityHeader";
import { getStickyColor } from "src/components/board/activity/StickySort/stickyColors";
import UncategorizedStickies from "src/components/board/activity/StickySort/UncategorizedStickies";
import QuoteApp from "src/components/board/activity/StickySort/Woke";
import StickyNoteInput from "src/components/board/StickyNoteInput";
import TempBoardContext from "src/contexts/TempBoardContext";

interface StickySortProps {}

export default function StickySort(props: StickySortProps) {
  const { user_id, activities, current_activity } =
    useContext(TempBoardContext);

  const stickyIdToSticky = useMemo(() => {
    if (!current_activity) {
      return {};
    }

    return current_activity.stickies.reduce((map, sticky) => {
      map[sticky.id] = sticky;
      return map;
    }, {} as { [key: string]: Sticky });
  }, [current_activity]);

  function onDragEnd() {}
  return (
    <>
      {current_activity && (
        <div className={"flex flex-col w-full h-full"}>
          <ActivityHeader
            title={current_activity.title}
            description={current_activity.description}
          />
          <DragDropContext onDragEnd={onDragEnd}>
            <div className={"flex-1 min-h-0 flex"}>
              <QuoteApp
                stickyIdToSticky={stickyIdToSticky}
                activity_groups={current_activity.activity_groups}
                className="flex-1 min-w-0 h-full overflow-auto p-10"
              />
              {/*<div className="flex-1">nuts</div>*/}
              <UncategorizedStickies />
              <StickyNoteInput />
            </div>
          </DragDropContext>
        </div>
      )}
    </>
  );
}
