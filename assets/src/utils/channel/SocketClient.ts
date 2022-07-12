import { Channel, Presence, Socket, SocketConnectOption } from "phoenix";
import { closeSocket, joinChannel, joinSocket } from "./channel";

const debug = require("debug")("app:SocketProvider");

interface SocketClientParams {
  token: string;
  user_id: string;
}

export default class SocketClient {
  url: string;
  user_id: string;
  params: SocketClientParams;
  opts: Partial<SocketConnectOption>;
  socket: Socket;

  constructor(
    url: string,
    params: SocketClientParams,
    opts: Partial<SocketConnectOption> = {}
  ) {
    const { user_id } = params;
    this.user_id = user_id;
    this.params = params;
    this.opts = opts;
    this.url = url;
  }

  async connect(): Promise<Socket> {
    if (this.socket) {
      return this.socket;
    } else {
      this.socket = await joinSocket(this.url, {
        ...this.opts,
        params: this.params,
      });
      return this.socket;
    }
  }

  async disconnect() {
    if (!this.socket) {
      await closeSocket(this.socket);
    }
  }

  async joinMyChannel(
    callback: (payload: { version: string }) => void
  ): Promise<Channel> {
    const socket = await this.connect();
    const channel = await joinChannel(
      socket,
      `user:${this.user_id}`,
      undefined,
      callback
    );
    debug("Joined MyChannel ", this.user_id);
    return channel;
  }

  //pass userStatusR to not rely on userstatus which will retrigger this everytime on change
  joinBoardChannel = async (
    board_id: string,
    payload: {
      userStatusR?: React.MutableRefObject<Partial<UserStatusState>> | null;
    }
  ): Promise<{ channel: Channel; presence: Presence }> => {
    if (!board_id) {
      throw new Error("Can't join board channel without board_id");
    }

    const socket = await this.connect();
    const channel = await joinChannel(socket, `board:${board_id}`, () => ({
      userStatus: payload.userStatusR?.current,
    }));

    const presence = new Presence(channel);
    return { channel, presence };
  };
}
