import { useContext } from "react";
import Navbar from "src/components/Navbar";
import UserContext from "src/contexts/UserContext";
import { useAppSelector } from "src/redux/hooks";
import ShareBoard from "./ShareBoard";

interface BoardNavbarProps {}

export default function BoardNavbar(props: BoardNavbarProps) {
  const { user } = useContext(UserContext);

  const boardId = useAppSelector((state) => state.board.id);

  const params = new URLSearchParams({ route: `/b/${boardId}` });
  user?.id && params.append("id", user?.id);

  return (
    <Navbar className="border-b border-gray-200" rightCls="text-right">
      <div className="flex items-end justify-end">
        <ShareBoard />
      </div>
    </Navbar>
  );
}
