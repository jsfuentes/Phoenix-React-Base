import React, { useContext } from "react";
import Button from "src/components/Button";
import Navbar from "src/components/Navbar";
import TempBoardContext from "src/contexts/TempBoardContext";

interface BoardNavbarProps {}

export default function BoardNavbar(props: BoardNavbarProps) {
  const { board } = useContext(TempBoardContext);

  return (
    <Navbar
      className="border-b-2 border-[#D2D1DB]"
      left={<div className={"font-medium"}>{board.title}</div>}
    >
      <Button variant="tertiary" onClick={() => {}}>
        Share
      </Button>
    </Navbar>
  );
}
