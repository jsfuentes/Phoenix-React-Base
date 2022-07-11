import React from "react";

interface BoardAgendaProps {}

const myLittleAgenda = [
  "Generate ideas",
  "Sort ideas by themes",
  "Blind vote on ideas",
];
export default function BoardAgenda(props: BoardAgendaProps) {
  return (
    <div className={"mt-2 border border-t-gray-200"}>
      {myLittleAgenda.map((item, index) => {
        return (
          <div
            key={index}
            className={
              "border border-b-gray-200 p-2 text-[#9F9CAF] text-sm font-medium"
            }
          >
            {`${index + 1}. `}
            {item}
          </div>
        );
      })}
    </div>
  );
}
