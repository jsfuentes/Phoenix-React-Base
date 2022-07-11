import React, { useMemo } from "react";
import TempBoardContext from "./TempBoardContext";

interface TempBoardContextProviderProps {
  children: React.ReactNode;
}

export default function TempBoardContextProvider(
  props: TempBoardContextProviderProps
) {
  const foo = "hello";

  const value = useMemo(() => {
    return {
      foo,
    };
  }, [foo]);

  return (
    <TempBoardContext.Provider value={value}>
      {props.children}
    </TempBoardContext.Provider>
  );
}
