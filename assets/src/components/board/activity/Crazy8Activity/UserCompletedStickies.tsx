import { useContext, useMemo } from "react";
import CompletedStickies from "src/components/Board/Sticky/CompletedStickies";
import UserContext from "src/contexts/UserContext";
import { useAppSelector } from "src/redux/hooks";
const debug = require("debug")("app:UserCompletedStickies");

interface UserCompletedStickiesProps {}

export default function UserCompletedStickies() {
  const { user } = useContext(UserContext);
  //TODO: Use one useAppSelector to get user completed stickies
  const stickyIds = useAppSelector((state) => state.board.stickies.allIds);
  const stickiesById = useAppSelector((state) => state.board.stickies.byId);
  const userId = user?.id;

  const userStickyIds = useMemo(() => {
    return stickyIds.filter(
      (stickyId) =>
        stickyId in stickiesById && stickiesById[stickyId].user_id === userId
    );
  }, [stickiesById, stickyIds, userId]);

  if (userStickyIds.length === 0) {
    return (
      <div className="w-full flex  font-medium text-gray-400 opacity-75">
        Ideas will show up here...
      </div>
    );
  }

  return (
    <CompletedStickies
      reverseStickyOrder={true}
      stickiesById={stickiesById}
      stickyIds={userStickyIds}
      showOptions={true}
    />
  );
}
