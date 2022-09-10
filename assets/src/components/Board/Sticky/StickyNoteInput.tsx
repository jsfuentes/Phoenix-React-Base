import classNames from "classnames";
import React, { useCallback, useContext, useEffect } from "react";
import StickyNoteForm from "src/components/board/Sticky/StickyNoteForm";
import BoardContext from "src/contexts/BoardContext";
import { useAppDispatch } from "src/redux/hooks";
import { logErrorMessage } from "src/redux/notification";
const debug = require("debug")("app:StickyNoteInput");

interface StickyNoteInputProps {
  className?: string;
  fullRounding?: boolean;
  stickyGroups?: string[];
  selectedStickyGroup?: string | null;
  setSelectedStickyGroup?: React.Dispatch<React.SetStateAction<string | null>>;
  showCloseButton?: boolean;
  onClose?: () => void;
  onStickySubmit?: () => void;
}

export default function StickyNoteInput(props: StickyNoteInputProps) {
  const { addSticky } = useContext(BoardContext);
  const { selectedStickyGroup, setSelectedStickyGroup, onStickySubmit } = props;
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (
      props.stickyGroups &&
      props.stickyGroups.length > 0 &&
      setSelectedStickyGroup &&
      selectedStickyGroup == null
    ) {
      setSelectedStickyGroup(props.stickyGroups[0]);
    }
  }, [props.stickyGroups, selectedStickyGroup, setSelectedStickyGroup]);

  const onSubmit = useCallback(
    async (title: string, description: string) => {
      if (!addSticky) {
        dispatch(
          logErrorMessage(
            "Submitting sticky note failed, try again or contact support - board function doesn't exist"
          )
        );
        return;
      }

      try {
        const sticky_groups = selectedStickyGroup ? [selectedStickyGroup] : [];

        await addSticky({
          title: title,
          description: description,
          sticky_groups,
        });

        // Can be used by parent to for ex hide the input on submit
        onStickySubmit && onStickySubmit();
      } catch (err) {
        debug("Adding sticky failed");
      }
    },
    [addSticky, dispatch, onStickySubmit, selectedStickyGroup]
  );

  return (
    <StickyNoteForm
      onSubmit={onSubmit}
      className={classNames({
        [props.className || ""]: props.className,
        "w-full min-h-48 md:h-[18rem]": true,
      })}
      showCloseButton={props.showCloseButton}
      fullRounding={props.fullRounding}
      onClose={props.onClose}
      stickyGroups={props.stickyGroups}
      selectedStickyGroup={selectedStickyGroup}
      setSelectedStickyGroup={setSelectedStickyGroup}
      resetOnSubmit={true}
    />
  );
}
