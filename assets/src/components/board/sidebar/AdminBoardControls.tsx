import React, { useRef } from "react";
import DelayedButton from "src/components/DelayedButton";
import TimerInput from "src/components/TimerInput";

interface AdminBoardControlsProps {}

export default function AdminBoardControls(props: AdminBoardControlsProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div className="bg-gray-200 border-b-2 border-r-2 border-[#D2D1DB] p-2">
      <div className={"flex"}>
        <DelayedButton
          variant="lightgray"
          onClick={() => {
            return;
          }}
          disabled={false}
          className="py-2 px-3 rounded-none rounded-tl-md rounded-bl-md rounded-tr-none rounded-br-none"
        >
          <i className="bx bx-skip-previous text-2xl" />
        </DelayedButton>
        <DelayedButton
          variant="tertiary"
          onClick={() => {
            return;
          }}
          disabled={false}
          className="py-2 px-3 rounded-tl-none rounded-bl-none rounded-tr-md rounded-br-md flex-1"
        >
          Next block <i className="bx bx-skip-next text-2xl" />
        </DelayedButton>
      </div>

      {/*<TimerInput />*/}
    </div>
  );
}
