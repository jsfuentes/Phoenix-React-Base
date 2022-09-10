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
import { add_update_sticky, update_board } from "src/redux/board";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import { logChannelPushError, logErrorMessage } from "src/redux/notification";
import { PresenceList, updatePresence } from "src/redux/presence";
import { updateSelf } from "src/redux/userStatus";
import { pushChannelAsync } from "src/utils/channel/channel";
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
  const [boardChannel, setBoardChannel] = useState<Channel | undefined>(
    undefined
  );
  const dispatch = useAppDispatch();

  const currentActivityId = useAppSelector(
    (state) => state.board.schedule_state?.activity_id
  );

  const updateBoardState = useCallback(
    (boardState: BoardState) => {
      debug("new board state", boardState);
      dispatch(update_board(boardState));
    },
    [dispatch]
  );

  useEffect(() => {
    let channel: Channel, presence: Presence;
    if (board_id && joinBoardChannel) {
      (async () => {
        try {
          debug("Joining board channel");
          const channelObj = await joinBoardChannel(
            board_id,
            { userStatusR },
            ({ data: boardState }) => updateBoardState(boardState)
          );
          debug("Joined board channel", channelObj?.channel?.state);

          channel = channelObj.channel;
          presence = channelObj.presence;
        } catch (err) {
          const message =
            "Something went wrong joining the board, please refresh the page and try again";
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
  }, [
    joinBoardChannel,
    board_id,
    dispatch,
    setUpdateChannel,
    userStatusR,
    updateBoardState,
  ]);

  useEffect(() => {
    if (!board_id) {
      dispatch(
        logErrorMessage(
          "No board id, try reopening the board or creating a new one"
        )
      );
    } else if (!boardChannel) {
      const timeoutId = setTimeout(() => {
        dispatch(
          logErrorMessage(
            "Timeout waiting for board channel, try refreshing the page"
          )
        );
      }, 7000);

      return () => clearTimeout(timeoutId);
    }
  }, [boardChannel, board_id, dispatch]);

  useEffect(() => {
    if (boardChannel) {
      boardChannel.on("board_state", updateBoardState);
      return () => boardChannel.off("board_state");
    }
  }, [boardChannel, updateBoardState]);

  useEffect(() => {
    function handleBoardDiff(diff: BoardDiff) {
      debug("Recieved board diff", diff);
      switch (diff.type) {
        case "add_sticky":
          dispatch(add_update_sticky(diff.payload));
          break;
        case "update_sticky":
          dispatch(add_update_sticky(diff.payload));
          break;
      }
    }

    if (boardChannel) {
      boardChannel.on("board_diff", handleBoardDiff);
      return () => boardChannel.off("board_diff");
    }
  }, [boardChannel, dispatch]);

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

  const addSticky = useCallback(
    async (newSticky: Partial<Sticky>) => {
      if (!boardChannel) {
        dispatch(
          logErrorMessage(
            "Updating sticky note failed, try again or contact support - invalid board connection"
          )
        );
        return;
      }

      try {
        const resp = await pushChannelAsync(boardChannel, "board_diff", {
          type: "add_sticky",
          payload: newSticky,
        });

        debug("add_sticky resp", resp);
      } catch (err) {
        dispatch(logChannelPushError(err, "Submitting Sticky"));
      }

      // segmentUserAction("Sticky Added", { newSticky });
    },
    [boardChannel, dispatch]
  );

  const value = useMemo(() => {
    return {
      boardChannel,
      addSticky,
    };
  }, [boardChannel, addSticky]);

  if (!boardChannel) {
    return <Loading />;
  }

  return (
    <BoardContext.Provider value={value}>
      {props.children}
    </BoardContext.Provider>
  );
}
