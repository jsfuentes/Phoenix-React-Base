import classNames from "classnames";
import { useCurrentActivity } from "src/redux/board";

interface ActivityHeaderProps {
  className?: string;
}

export default function ActivityHeader(props: ActivityHeaderProps) {
  const currentActivity = useCurrentActivity();
  const activityTitle = currentActivity?.title;
  const activityDescription = currentActivity?.description;

  return (
    <div
      className={classNames({
        [props.className || ""]: props.className,
        "w-full py-4 md:py-9 hidden md:block": true,
      })}
    >
      <div className="flex flex-row justify-between">
        <h1 className={"block text-gray-700 text-xl font-medium"}>
          {activityTitle}
        </h1>
      </div>
      <h4 className="text-gray-500/90 text-base mt-3 max-w-3xl hidden md:block">
        {activityDescription}
      </h4>
    </div>
  );
}
