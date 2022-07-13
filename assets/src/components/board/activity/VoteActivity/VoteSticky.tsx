import classNames from "classnames";
import React, { useState } from "react";
import Button from "src/components/Button";

interface VoteStickyProps {
  sticky: Sticky;
}

export default function VoteSticky(props: VoteStickyProps) {
  //  temp
  const [isVoted, setIsVoted] = useState(false);
  return (
    <div
      className={classNames({
        "p-2 rounded-md shadow-lg mr-3 mb-3 flex flex-col w-60 items-start gap-2 relative":
          true,
        "bg-white": !isVoted,
        "bg-gray-100": isVoted,
      })}
    >
      <div className={"text-gray-800"}>{props.sticky.text}</div>
      {isVoted ? (
        <Button onClick={() => setIsVoted(false)} variant="inverse-lightgray">
          Undo
        </Button>
      ) : (
        <Button
          onClick={() => setIsVoted(true)}
          variant="lightgray"
          className={"border-2 border-transparent"}
        >
          Vote
        </Button>
      )}
      {isVoted && (
        <div
          className={
            "flex justify-center items-center absolute right-0 top-0 -translate-y-1/3 translate-x-1/3 rounded-full h-6 w-6 bg-emerald-500"
          }
        >
          <i className="bx bx-check text-white text-xl" />
        </div>
      )}
    </div>
  );
}
