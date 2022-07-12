import React from "react";

export interface TempBoardContextContextType {
  current_activity: Activity | null;
  activities: Activity[];
  user_id: number;
  stickyIdToSticky: { [key: string]: Sticky };
  board: Board;
}

const TempBoardContextContext =
  React.createContext<TempBoardContextContextType>({
    current_activity: null,
    activities: [],
    user_id: 0,
    stickyIdToSticky: {},
    board: {
      owner_id: 0,
      title: "This is my board title",
      description: "This is my board description",
    },
  });

export default TempBoardContextContext;
