import React from "react";
import { BoardContextType } from "src/types/contexts/BoardContext";

const BoardContext = React.createContext<BoardContextType>({
  boardChannel: null,
});

export default BoardContext;
