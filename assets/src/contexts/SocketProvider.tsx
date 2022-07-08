import * as Sentry from "@sentry/react";
import { Channel } from "phoenix";
import React, { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import UserContext from "src/contexts/UserContext";
import SocketClient from "src/utils/channel/SocketClient";
import SocketContext from "./SocketContext";
const debug = require("debug")("app:SocketProvider");

interface SocketProviderProps {
  children: React.ReactNode;
}

//using React context and provider because user changes need to change sockets and then children might need to update their listeners on socket changes
export default function SocketProvider(props: SocketProviderProps) {
  const { user } = useContext(UserContext);
  const [socketClient, setSocketClient] = useState<SocketClient | null>(null);
  const [myChannel, setMyChannel] = useState<Channel | null>(null);
  const [currentVersion, setCurrentVersion] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const versionR = useRef<null | string>(null);

  const user_id = user && user.id;
  const user_socket_token = user && user.socket_token;

  useEffect(() => {
    if (currentVersion !== versionR.current) {
      if (versionR.current !== null && currentVersion !== null) {
        setIsRefreshing(true);
      }
      debug("New version", currentVersion);
      versionR.current = currentVersion;
    }
  }, [currentVersion]);

  useEffect(() => {
    if (isRefreshing) {
      toast(
        "✨ New version of Clayboard available! Automatically restarting in 8 seconds..."
      );
      const timeoutId = setTimeout(() => window.location.reload(), 8000);
      return () => clearTimeout(timeoutId);
    }
  }, [isRefreshing]);

  useEffect(() => {
    //wait for user to finish loading from UserProvider
    if (!user_socket_token || !user_id) {
      return;
    }

    let isCancelled = false;
    let client: SocketClient;

    (async () => {
      try {
        client = new SocketClient("/socket", {
          token: user_socket_token,
          user_id,
        });
        //connect could throw errors
        await client.connect();
        if (isCancelled) {
          return;
        }
        setSocketClient(client);
      } catch (err) {
        const message = `Problem connecting to socket, try refreshing: ${err}`;
        Sentry.captureException(err);
        console.error(message);
        toast(message);
        return;
      }

      try {
        const channel = await client.joinMyChannel((payload) => {
          const newVersion = payload.version;
          setCurrentVersion(newVersion);
        });

        if (isCancelled) {
          return;
        }
        setMyChannel(channel);
      } catch (err) {
        if (isCancelled) {
          return;
        }
        const message = `Joining MyChannel failed: ${err}`;
        Sentry.captureException(err);
        console.error(message);
        toast(message);
      }
    })();

    return () => {
      isCancelled = true;
      setSocketClient(null);
      setMyChannel(null);
      //assuming disconnecting from socket disconnects all channels
      client && client.disconnect();
    };
  }, [user_id, user_socket_token]); //any updateUser with same user doesn't update this

  //will all be null if socketClient null
  const joinBoardChannel = socketClient ? socketClient.joinBoardChannel : null;

  return (
    <SocketContext.Provider
      value={{
        isRefreshing,
        myChannel,
        joinBoardChannel,
      }}
    >
      {props.children}
    </SocketContext.Provider>
  );
}
