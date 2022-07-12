import React from "react";

export interface TempBoardContextContextType {
  current_activity: Activity | null;
  activities: Activity[];
  user_id: number;
}

const TempBoardContextContext =
  React.createContext<TempBoardContextContextType>({
    current_activity: null,
    activities: [],
    user_id: 0,
  });

export default TempBoardContextContext;
