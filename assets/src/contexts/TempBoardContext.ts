import React from "react";

export interface TempBoardContextContextType {
  foo: string;
}

const TempBoardContextContext =
  React.createContext<TempBoardContextContextType>({
    foo: "bar",
  });

export default TempBoardContextContext;
