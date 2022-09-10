import React from "react";
import { BoardContextType } from "src/types/contexts/BoardContext";

const BoardContext = React.createContext<BoardContextType>({});

export default BoardContext;
