import React from "react";
import { UserStatusContextType } from "src/types/contexts/UserStatusContext";

const UserStatusContext = React.createContext<UserStatusContextType>({
  userStatusR: null,
  setUpdateChannel: null,
});

export default UserStatusContext;
