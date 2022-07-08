import { Channel } from "phoenix";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import { logChannelPushError } from "src/redux/notification";
import { pushChannelAsync } from "src/utils/channel/channel";
import UserStatusContext from "./UserStatusContext";
const debug = require("debug")("app:UserStatusProvider");

interface UserStatusProviderProps {
  children: React.ReactNode;
}

export default function UserStatusProvider(props: UserStatusProviderProps) {
  const userStatusR = useRef<Partial<UserStatusState>>({}); //R so rejoining the socket automatically uses most upto date reference
  const [updateChannel, setUpdateChannel] = useState<Channel | null>(null); //probably inEChannel
  const userStatus = useAppSelector((state) => state.userStatus);
  const dispatch = useAppDispatch();

  useEffect(() => {
    userStatusR.current = userStatus;
  }, [userStatus]);

  useEffect(() => {
    (async () => {
      if (updateChannel) {
        try {
          await pushChannelAsync(updateChannel, "update_self", userStatus);
        } catch (err) {
          dispatch(
            logChannelPushError(err, "Sending Updates to Server", {
              recommend: "check your internet connection and try again",
              notifType: null,
            })
          );
        }
      }
    })();
  }, [userStatus, updateChannel, dispatch]);

  const value = useMemo(
    () => ({
      userStatusR,
      setUpdateChannel,
    }),
    [userStatusR, setUpdateChannel]
  );

  return (
    <UserStatusContext.Provider value={value}>
      {props.children}
    </UserStatusContext.Provider>
  );
}
