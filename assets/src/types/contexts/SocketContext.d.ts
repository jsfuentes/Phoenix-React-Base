import { Channel, Presence } from "phoenix";

export interface SocketContextType {
  isRefreshing: boolean;
  myChannel: null | Channel;
  joinBoardChannel:
    | null
    | ((
        board_id: string,
        payload: {
          userStatusR: React.MutableRefObject<Partial<UserStatusState>> | null;
        }
      ) => Promise<{ channel: Channel; presence: Presence }>);
}
