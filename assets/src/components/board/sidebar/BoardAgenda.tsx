import classNames from "classnames";
import { useContext } from "react";
import TempBoardContext from "src/contexts/TempBoardContext";
const debug = require("debug")("app:sidebar:BoardAgenda");
interface BoardAgendaProps {}

export default function BoardAgenda(props: BoardAgendaProps) {
  const { user_id, activities, current_activity, stickyIdToSticky } =
    useContext(TempBoardContext);

  // TODO overflow
  return (
    <div className={"mt-2 border border-t-gray-200"}>
      {activities.map((activity, index) => {
        return (
          <div
            key={index}
            className={classNames({
              "text-primary-500 bg-primary-500/[0.08]":
                current_activity?.id === activity.id,
              "text-[#9F9CAF]": current_activity?.id !== activity.id,
              "border-b border-b-gray-200 p-2 text-sm font-medium": true,
            })}
          >
            {`${index + 1}. `}
            {activity.title}
          </div>
        );
      })}
    </div>
  );
}
