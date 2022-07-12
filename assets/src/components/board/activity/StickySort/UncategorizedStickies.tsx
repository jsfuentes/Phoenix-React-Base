import classNames from "classnames";
import React from "react";
import { Droppable } from "react-beautiful-dnd";

interface UncategorizedStickiesProps {}

export default function UncategorizedStickies(
  props: UncategorizedStickiesProps
) {
  return (
    <div className="w-60 flex-none bg-gray-100 h-full flex flex-col">
      <div className="p-4 bg-white text-gray-600">
        <span>Uncategorized </span>
        <span className={"text-gray-400"}>4</span>
      </div>
      <Droppable droppableId={`unassigned_group`}>
        {(provided: any, snapshot: any) => (
          <div
            ref={provided.innerRef}
            className={classNames({
              [`w-64 h-full p-3 bg-gray-100`]: true,
            })}
            {...provided.droppableProps}
          >
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
