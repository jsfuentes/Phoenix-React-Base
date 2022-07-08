import { Channel } from "phoenix";

export default class ChannelPushError extends Error {
  isChannelPushError: boolean;
  reason: string;
  topic: string;
  channelMessage: string;
  body: Object;

  //without constructor will include this class in stack trace
  constructor(
    channel: Channel,
    channelMessage: string,
    body: Object,
    reason = "Unknown"
  ) {
    super(reason);
    this.name = `${channelMessage}ERROR`;
    this.isChannelPushError = true;
    this.reason = reason;

    //@ts-ignore TODO: Check if this works as its not in the types but I think it does
    this.topic = channel && channel.topic;
    this.channelMessage = channelMessage;
    this.body = body;
    if (Error.captureStackTrace !== undefined) {
      //Firefox problem, since its non-standard
      Error.captureStackTrace(this, ChannelPushError);
    }
  }
}

//doesn't seem to work if its a class method
export function getChannelPushErrorData(err: ChannelPushError) {
  return {
    reason: err.reason,
    topic: err.topic,
    channelMessage: err.channelMessage,
    body: err.body,
  };
}
