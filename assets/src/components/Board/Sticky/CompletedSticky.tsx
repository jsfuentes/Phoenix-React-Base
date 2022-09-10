import classNames from "classnames";
import { ReactNode, useContext, useState } from "react";
import UserContext from "src/contexts/UserContext";
const debug = require("debug")("app:CompletedSticky");

interface CompletedStickyProps {
  stickyId: string;
  title: string;
  description?: string;
  showOptions?: boolean;
  children?: ReactNode;
  className?: string;
  bg: string;
  border?: string;
  width: string | null;
  topContent?: ReactNode;
  disableDoubleClick?: boolean;
}

CompletedSticky.defaultProps = {
  bg: "bg-sticky",
  width: "w-64",
};

export default function CompletedSticky(props: CompletedStickyProps) {
  const { stickyId, title, description } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const { user } = useContext(UserContext);

  return (
    <div
      className={classNames({
        "drop-shadow-sticky rounded-md text-gray-700": true,
        [props.border || "border border-gray-200"]: true,
        [props.className || ""]: props.className,
        [props.bg]: props.bg,
        [props.width || ""]: props.width,
      })}
      onDoubleClick={() => !props.disableDoubleClick && setIsEditing(true)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {props.topContent}
      <div className="px-5 py-4 ">
        <div className={"flex justify-between font-medium"}>
          <div style={{ overflowWrap: "anywhere" }}>{title}</div>
        </div>
        {description && (
          <div
            className={"mt-1 text-gray-700/60 whitespace-pre-wrap"}
            style={{ overflowWrap: "anywhere" }}
          >
            {description}
          </div>
        )}
        {props.children}
      </div>
    </div>
  );
}
