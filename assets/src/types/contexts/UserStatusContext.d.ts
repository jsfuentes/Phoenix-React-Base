import { Channel } from "phoenix";

export interface UserStatusContextType {
  userStatusR: null | React.MutableRefObject<Partial<UserStatusState>>;
  setUpdateChannel: null | React.Dispatch<React.SetStateAction<Channel | null>>;
}
