import * as Sentry from "@sentry/react";
import { Channel, Socket, SocketConnectOption } from "phoenix";
import ChannelPushError, {
  getChannelPushErrorData,
} from "src/utils/ChannelPushError";
import { sleep } from "src/utils/helpers";
const debug = require("debug")("app:utils:channel");

/*
  channel: eChannel
  message: "join_stage"
  body: { subevent_id: currentSubevent.id } 
*/

const PUSH_TIMEOUT = 8000;

export function pushChannelAsync(
  channel: Channel,
  message: string,
  body: Object = {},
  i = 0
): Promise<any> {
  //console.log("pushin", channel, message, body, i);
  return new Promise((resolve, reject) => {
    if (!channel) {
      console.error(`Tried to push ${message} on channel that doesn't exist`);
      reject(
        new ChannelPushError(channel, message, body, "Channel doesn't exist")
      );
      return;
    }

    if (channel.state !== "joined") {
      console.error(`Tried to push ${message} on ${channel.state} channel`);
      reject(
        new ChannelPushError(
          channel,
          message,
          body,
          `Channel is in state ${channel.state}`
        )
      );
      return;
    }

    debug("Push", message, body, i);
    channel
      .push(message, body, PUSH_TIMEOUT)
      .receive("ok", (resp) => {
        resolve(resp);
      })
      //TODO: Type reason I think its a string?
      .receive("error", (reason) => {
        console.log("REASON", reason);
        console.error("Push error", { message, body, reason }); //not debug cuz want to print object
        Sentry.captureMessage("Push Error Reason", { extra: { reason } });
        //TODO: Check logs and ensure this is a string
        reject(new ChannelPushError(channel, message, body, reason));
      })
      .receive("timeout", () => {
        console.error("Push timeout", { message, body }); //not debug cuz want to print object
        reject(new ChannelPushError(channel, message, body, "Timeout"));
      });
  });
}

export async function pushChannelWithRetryAsync(
  channel: Channel,
  message: string,
  body: Object = {}
): Promise<any> {
  if (!channel) {
    throw new ChannelPushError(channel, message, body, "Channel doesn't exist");
  }

  const errs = [];
  let timeoutDelay = 125; //250 500 1000 2000 4000
  let lastError;
  while (timeoutDelay <= PUSH_TIMEOUT) {
    if (channel.state !== "joined") {
      console.error(`Tried to push ${message} on ${channel.state} channel`);
      throw new ChannelPushError(
        channel,
        message,
        body,
        `Channel is in state ${channel.state}`
      );
    }

    try {
      const resp = await pushChannelAsync(channel, message, body, timeoutDelay);
      return resp;
    } catch (err) {
      errs.push(err);
      lastError = err;
    }

    timeoutDelay = timeoutDelay * 2;
    if (timeoutDelay < 5000) {
      debug("Retrying", message, "in", timeoutDelay);
      await sleep(timeoutDelay);
    } else {
      break;
    }
  }

  const errsData = errs.map((err) => getChannelPushErrorData(err));
  Sentry.captureMessage(`${message} failed with async retry`, {
    extra: { errsData },
  });
  throw lastError;
}

//params can be the value or a function to be called on connect
export function joinChannel(
  socket: Socket,
  channelName: string,
  params?: Object,
  callback?: (resp: any) => void
): Promise<Channel> {
  return new Promise((resolve, reject) => {
    if (!socket) {
      reject(new Error("Socket doesn't exist"));
      return;
    }

    const channel = socket.channel(channelName, params);

    channel
      .join()
      .receive("ok", (resp) => {
        debug(`Joined ${channelName}`, resp);
        resolve(channel);
        callback && callback(resp);
      })
      .receive("error", ({ reason }) => reject(new Error(reason)))
      .receive("timeout", () => reject(new Error("Join channel timeout")));

    channel.onError((err) => {
      console.error(`${channelName} channel error`, err);
      // Sentry.captureMessage("Channel Error", { extra: { channelName } });
    });

    channel.onClose(() => {
      debug(`${channelName} closed`);
    });
  });
}

export function joinSocket(
  endPoint: string,
  opts?: Partial<SocketConnectOption>
): Promise<Socket> {
  return new Promise((resolve, reject) => {
    const socket = new Socket(endPoint, opts);
    socket.connect();

    socket.onOpen(() => {
      // debug("OPEN SOCKET");
      resolve(socket);
    });

    socket.onClose(() => debug("CLOSE SOCKET"));
    //Can't actually distinguish why the error is happening, https://groups.google.com/g/phoenix-core/c/mxHNfe1ihFQ/m/zlmU13qHAwAJ?pli=1
    socket.onError((err) => {
      console.error(`Socket base err`, err.message);
      reject(new Error(err));
    });
  });
}

export function closeSocket(socket: Socket): Promise<void> {
  return new Promise((resolve, reject) => {
    socket.disconnect(() => {
      debug("Disconnect from socket");
      resolve();
    });
  });
}
