import * as Sentry from "@sentry/react";
import { Channel, Presence } from "phoenix";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "src/components/Loading";
import SocketContext from "src/contexts/SocketContext";
import UserStatusContext from "src/contexts/UserStatusContext";
import { updateBoard } from "src/redux/board";
import { useAppDispatch } from "src/redux/hooks";
import { PresenceList, updatePresence } from "src/redux/presence";
import { updateSelf } from "src/redux/userStatus";
import BoardContext from "./BoardContext";
import UserContext from "./UserContext";
const debug = require("debug")("app:BoardProvider");

interface BoardProviderProps {
  children: React.ReactNode;
}

export default function BoardProvider(props: BoardProviderProps) {
  const params = useParams<{ board_id: string }>();
  const board_id = params.board_id;
  const { user } = useContext(UserContext);
  const { userStatusR, setUpdateChannel } = useContext(UserStatusContext);
  const { joinBoardChannel } = useContext(SocketContext);
  const [boardChannel, setBoardChannel] = useState<Channel | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    let channel: Channel, presence: Presence;
    if (board_id && joinBoardChannel) {
      (async () => {
        try {
          debug("Joining board channel");
          const channelObj = await joinBoardChannel(board_id, { userStatusR });
          channel = channelObj.channel;
          presence = channelObj.presence;
        } catch (err) {
          const message =
            "Join board channel failed, refresh the page and try again";
          toast(message);
          Sentry.captureException(err);
          console.error(message, err);
          return;
        }

        function updatePList(presence: Presence) {
          const pList: PresenceList = presence.list();
          debug("PLIST", pList);
          dispatch(updatePresence(pList));
        }

        //only one onsync handler allowed
        presence.onSync(() => updatePList(presence));
        updatePList(presence);
        setBoardChannel(channel);
        setUpdateChannel && setUpdateChannel(channel);
        // window.inevent = channel;
      })();
    }

    return () => {
      if (channel) {
        debug("SPTR Leaving inevent channel");
        channel.leave();
        setUpdateChannel && setUpdateChannel(null);
      }
    };
  }, [joinBoardChannel, board_id, dispatch, setUpdateChannel, userStatusR]);

  const updateBoardState = useCallback((boardState: BoardState) => {
    debug("new board state", boardState);
    dispatch(updateBoard(boardState));
  }, []);

  useEffect(() => {
    if (boardChannel) {
      boardChannel.on("board_state", updateBoardState);
      return () => boardChannel.off("get_board_state");
    }
  }, [boardChannel, updateBoardState]);

  useEffect(
    function syncAttendeeInfo() {
      dispatch(
        updateSelf({
          id: user?.id,
          name: user?.name,
          picture: user?.picture,
          type: user?.type,
          status: "active",
        })
      );
    },
    [user, dispatch]
  );

  const value = useMemo(() => {
    return {
      boardChannel,
    };
  }, [boardChannel]);

  if (!boardChannel) {
    return <Loading />;
  }

  return (
    <BoardContext.Provider value={value}>
      {props.children}
    </BoardContext.Provider>
  );
}
