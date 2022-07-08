import React from "react";
import { SocketContextType } from "src/types/contexts/SocketContext";

const SocketContext = React.createContext<SocketContextType>({
  isRefreshing: false,
  myChannel: null,
  joinBoardChannel: null,
});

export default SocketContext;
