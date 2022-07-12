import React, { useState } from "react";
import Dropdown, { MenuContainer, MenuItem } from "src/components/Dropdown";
import Modal from "src/components/Modal";

interface CompletedStickyProps {
  stickyId: number;
  stickyText: string;
}

export default function CompletedSticky(props: CompletedStickyProps) {
  const { stickyId, stickyText } = props;
  const [isEditing, setIsEditing] = useState(false);
  return (
    <div
      key={stickyId}
      className={
        "w-60 p-6 bg-sticky shadow-xl rounded-md text-gray-800 flex justify-between"
      }
    >
      {stickyText}
      <Dropdown
        type="click"
        hoverPlace="bottom"
        className="right-0 top-10 shadow-md"
        hoverElement={
          <MenuContainer>
            {/* <MenuItem
                icon="bx bx-upload"
                onClick={() => setShowUploadModal(true)}
              >
                Add attendees to allowlist
              </MenuItem> */}
            <MenuItem
              icon="bx bxs-pencil"
              onClick={() => {
                setIsEditing(true);
              }}
            >
              Edit
            </MenuItem>
            <MenuItem icon="bx bx-trash" onClick={() => {}}>
              Delete
            </MenuItem>
          </MenuContainer>
        }
      >
        <div
          className={
            "flex items-center justify-center shadow-md hover:bg-gray-200 px-2 py-1 rounded-md cursor-pointer"
          }
        >
          <i className={"text-gray-400 bx bx-dots-horizontal"} />
        </div>
      </Dropdown>
      <Modal
        className="w-11/12 md:w-full h-40 max-w-md rounded-xl border-4 border-orange-500 border-solid"
        isOpen={isEditing}
      >
        Hi Im editing
      </Modal>
    </div>
  );
}
