import ActiveBoard from "src/components/Board/ActiveBoard";
import BoardNavbar from "src/components/Board/BoardNavbar";
import BoardProvider from "src/contexts/BoardProvider";

interface BoardProps {}

export default function Board(props: BoardProps) {
  return (
    <BoardProvider>
      <div className={"h-screen flex flex-col "}>
        <BoardNavbar />
        <div className={"flex-1 flex overflow-hidden"}>
          <ActiveBoard className={"flex-1 min-h-0"} />
        </div>
      </div>
    </BoardProvider>
  );
}
