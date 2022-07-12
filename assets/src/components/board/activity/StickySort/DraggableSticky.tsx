import React from "react";
import { Draggable } from "react-beautiful-dnd";

interface DraggableStickyProps {
  sticky_id: number;
  index: number;
  text: string;
  user: string;
}

export default function DraggableSticky(props: DraggableStickyProps) {
  const { sticky_id, index, text, user } = props;
  return (
    <Draggable
      key={`sticky-${sticky_id}`}
      draggableId={`sticky-${sticky_id}`}
      index={index}
    >
      {(provided: any, snapshot: any) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={provided.draggableProps.style}
          className={"select-none bg-sticky mb-2 shadow-sm rounded-lg"}
        >
          <div
            className={
              "flex items-center text-gray-600 font-medium px-3 py-2 border-b border-b-[#92400E]/[0.1]"
            }
          >
            {text}
          </div>
          <div className={"px-3 py-2 text-gray-400 text-sm"}>{user}</div>
        </div>
      )}
    </Draggable>
  );
}
