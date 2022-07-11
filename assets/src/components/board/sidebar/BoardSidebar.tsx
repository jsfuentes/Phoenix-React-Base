import React from "react";
import AdminBoardControls from "src/components/board/sidebar/AdminBoardControls";
import BoardAgenda from "src/components/board/sidebar/BoardAgenda";

interface SidebarProps {}

export default function BoardSidebar(props: SidebarProps) {
  return (
    <div className={"bg-gray-100 w-60 flex flex-col"}>
      <AdminBoardControls />
      <BoardAgenda />
    </div>
  );
}
