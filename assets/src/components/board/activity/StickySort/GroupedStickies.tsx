import classNames from "classnames";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DraggableSticky from "src/components/board/activity/StickySort/DraggableSticky";
import { getStickyColor } from "src/components/board/activity/StickySort/stickyColors";

interface GroupedStickiesProps {
  className?: string;
  activity_groups: ActivityGroup[];
  stickyIdToSticky: {
    [key: string]: Sticky;
  };
}

// fake data generator
const getItems = (count: any, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k + offset}-${new Date().getTime()}`,
    content: `item ${k + offset}`,
  }));

const reorder = (list: any, startIndex: any, endIndex: any) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (
  source: any,
  destination: any,
  droppableSource: any,
  droppableDestination: any
) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result: any = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

export default function GroupedStickies(props: GroupedStickiesProps) {
  const [state, setState] = useState([getItems(10), getItems(5, 10)]);
  console.log("THOMASSS", props);
  // function onDragEnd(result: any) {
  //   const { source, destination } = result;
  //
  //   // dropped outside the list
  //   if (!destination) {
  //     return;
  //   }
  //   const sInd = +source.droppableId;
  //   const dInd = +destination.droppableId;
  //
  //   if (sInd === dInd) {
  //     const items = reorder(state[sInd], source.index, destination.index);
  //     const newState: any = [...state];
  //     newState[sInd] = items;
  //     setState(newState);
  //   } else {
  //     const result = move(state[sInd], state[dInd], source, destination);
  //     const newState = [...state];
  //     newState[sInd] = result[sInd];
  //     newState[dInd] = result[dInd];
  //
  //     setState(newState.filter((group) => group.length));
  //   }
  // }

  return (
    <div
      className={classNames({
        [props.className || ""]: props.className,
      })}
    >
      <button
        type="button"
        onClick={() => {
          setState([...state, []]);
        }}
      >
        Add new group
      </button>
      <button
        type="button"
        onClick={() => {
          setState([...state, getItems(1)]);
        }}
      >
        Add new item
      </button>
      <div className={"flex items-start w-fit mb-52 gap-4"}>
        {props.activity_groups.map((activity_group, ind) => (
          <Droppable key={ind} droppableId={`${ind}`}>
            {(provided: any, snapshot: any) => (
              <div
                ref={provided.innerRef}
                className={classNames({
                  [`w-64 min-h-0 p-3 rounded-md bg-${getStickyColor(ind)}-100`]:
                    true,
                })}
                {...provided.droppableProps}
              >
                <div
                  className={`bg-${getStickyColor(
                    ind
                  )}-200 inline-block rounded-2xl py-1 px-3 mb-3 font-medium text-${getStickyColor(
                    ind
                  )}-800`}
                >
                  {activity_group.title}
                </div>
                {activity_group.sticky_ids.map((sticky_id, index) => (
                  <>
                    {sticky_id in props.stickyIdToSticky && (
                      <DraggableSticky
                        sticky_id={sticky_id}
                        text={props.stickyIdToSticky[sticky_id].text}
                        index={index}
                        user={`user: ${props.stickyIdToSticky[sticky_id].user_id}`}
                      />
                    )}
                  </>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </div>
  );
}
