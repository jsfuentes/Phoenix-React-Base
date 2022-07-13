import ActiveBoard from "src/components/board/ActiveBoard";
import BoardJoinModal from "src/components/board/BoardJoinModal";
import BoardNavbar from "src/components/board/BoardNavbar";
import BoardSidebar from "src/components/board/sidebar/BoardSidebar";
import Navbar from "src/components/Navbar";
import BoardProvider from "src/contexts/BoardProvider";
import TempBoardContextProvider from "src/contexts/TempBoardContextProvider";

interface BoardProps {}

export default function Board(props: BoardProps) {
  return (
    <BoardProvider>
      <TempBoardContextProvider>
        <div className={"h-screen flex flex-col "}>
          <BoardNavbar />
          <div className={"flex-1 flex overflow-hidden"}>
            <BoardSidebar />
            <ActiveBoard className={"flex-1 min-h-0"} />
          </div>
        </div>
        {/*<BoardJoinModal isOpen={true} />*/}
      </TempBoardContextProvider>
    </BoardProvider>
  );
}
