import { useState } from "react";
import { toast } from "react-toastify";
import Button from "src/components/Button";
import Dropdown from "src/components/Dropdown";
import { useAppSelector } from "src/redux/hooks";
import { copyToClipboard } from "src/utils/helpers";
import { getBoardUrl } from "src/utils/url";

interface ShareBoardProps {}

export default function ShareBoard(props: ShareBoardProps) {
  const [copied, setCopied] = useState(false);
  const boardId = useAppSelector((state) => state.board.id);

  if (!boardId) {
    return null;
  }

  const boardUrl = getBoardUrl(boardId);

  function copyUrlToClipboard() {
    toast("Copied link to clipboard", {
      toastId: "copy-url-to-clipboard",
      autoClose: 2000,
      hideProgressBar: true,
    });
    copyToClipboard(boardUrl);
    setCopied(true);
  }

  return (
    <Dropdown
      closeOnClick={true}
      type="click"
      hoverPlace="bottom"
      hoverElement={
        <div className="w-full py-6 px-7">
          <div className="text-gray-700 font-medium text-2xl">
            Share with participants
          </div>
          <div className="text-gray-500/75 mt-1.5">
            1-click enter. No signup or email required.
          </div>
          <input
            onClick={copyUrlToClipboard}
            className="cursor-pointer form-input w-full text-base bg-gray-50 border mt-5 border-gray-200 rounded text-gray-400"
            value={boardUrl}
          />
          <Button
            variant={"primary"}
            fullWidth={true}
            className="mt-1"
            onClick={copyUrlToClipboard}
          >
            Copy Private Link
          </Button>
        </div>
      }
      className="right-0 top-10 drop-shadow-xl border border-gray-100"
      hoverSize="w-96"
    >
      <Button variant={"inverse-lightgray"} className="block">
        Invite Participants
      </Button>
    </Dropdown>
  );
}
