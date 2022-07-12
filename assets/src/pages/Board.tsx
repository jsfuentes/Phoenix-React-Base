import React from "react";
import ActiveBoard from "src/components/board/ActiveBoard";
import BoardSidebar from "src/components/board/sidebar/BoardSidebar";
import Navbar from "src/components/Navbar";
import TempBoardContextProvider from "src/contexts/TempBoardContextProvider";

interface BoardProps {}

export default function Board(props: BoardProps) {
  return (
    <TempBoardContextProvider>
      <div className={"h-screen flex flex-col "}>
        <Navbar className="border-b-2 border-[#D2D1DB]">hello</Navbar>
        <div className={"flex-1 flex h-full overflow-hidden"}>
          <BoardSidebar />
          <ActiveBoard className={"flex-1"} />
        </div>
      </div>
    </TempBoardContextProvider>
  );
}
