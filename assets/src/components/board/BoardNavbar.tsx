import React, { useContext } from "react";
import Button from "src/components/Button";
import Navbar from "src/components/Navbar";
import TempBoardContext from "src/contexts/TempBoardContext";
import { useAppSelector } from "src/redux/hooks";

interface BoardNavbarProps {}

export default function BoardNavbar(props: BoardNavbarProps) {
  const { board } = useContext(TempBoardContext);
  const boardTitle = useAppSelector((state) => state.board.title);

  return (
    <Navbar
      className="border-b-2 border-[#D2D1DB]"
      left={<div className={"font-medium"}>{boardTitle}</div>}
    >
      <Button variant="tertiary" onClick={() => {}}>
        Share
      </Button>
    </Navbar>
  );
}
