import { Channel, Presence } from "phoenix";

export interface SocketContextType {
  isRefreshing: boolean;
  myChannel: null | Channel;
  joinBoardChannel:
    | null
    | ((board_id: string) => Promise<{ channel: Channel; presence: Presence }>);
}
