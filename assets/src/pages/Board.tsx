import conf from "conf";
import { Helmet } from "react-helmet";
import ActiveBoard from "src/components/Board/ActiveBoard";
import BoardNavbar from "src/components/Board/BoardNavbar";
import BoardProvider from "src/contexts/BoardProvider";
import { useAppSelector } from "src/redux/hooks";

interface BoardProps {}

export default function Board(props: BoardProps) {
  const boardTitle = useAppSelector((state) => state.board.title);
  const boardPrompt = useAppSelector((state) => state.board.prompt);

  return (
    <BoardProvider>
      <Helmet>
        <title>
          {boardTitle ||
            `${conf.get("PROJECT_NAME")} Session${
              boardPrompt ? ` - ${boardPrompt}` : ""
            }`}
        </title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className={"h-screen flex flex-col "}>
        <BoardNavbar />
        <div className={"flex-1 flex overflow-hidden"}>
          <ActiveBoard className={"flex-1 min-h-0"} />
        </div>
      </div>
    </BoardProvider>
  );
}
