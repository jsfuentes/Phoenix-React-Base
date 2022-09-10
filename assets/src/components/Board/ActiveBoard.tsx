import classNames from "classnames";
import Crazy8Activity from "src/components/Board/Activity/Crazy8Activity";
import { useAppSelector } from "src/redux/hooks";
const debug = require("debug")("app:components:Board:ActiveBoard");

interface ActiveBoardProps {
  className?: string;
}

export default function ActiveBoard(props: ActiveBoardProps) {
  const currentActivityType = useAppSelector((state) =>
    state.board.schedule_state?.activity_id
      ? state.board.activities.byId[state.board.schedule_state?.activity_id]
          .type
      : null
  );

  let activity = null;
  switch (currentActivityType) {
    case "crazy8":
      activity = <Crazy8Activity />;
      break;
    default:
      break;
  }

  return (
    <div
      className={classNames({
        [props.className || ""]: props.className,
        "flex bg-gray-50 overflow-hidden": true,
      })}
    >
      {activity}
    </div>
  );
}
