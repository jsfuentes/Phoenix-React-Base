import React from "react";
import CompletedSticky from "src/components/board/activity/Crazy8Activity/CompletedSticky";
import Button from "src/components/Button";
import Dropdown, { MenuContainer, MenuItem } from "src/components/Dropdown";

interface CompletedStickiesProps {
  selectedUserActivityGroup: ActivityGroup;
  stickyIdToSticky: { [stickyId: string]: Sticky };
}

export default function CompletedStickies(props: CompletedStickiesProps) {
  return (
    <div className={"w-fit mb-4 flex flex-col flex-wrap gap-4"}>
      {props.selectedUserActivityGroup.sticky_ids.map((stickyId) => {
        return (
          <>
            {stickyId in props.stickyIdToSticky && (
              <CompletedSticky
                stickyId={stickyId}
                stickyText={props.stickyIdToSticky[stickyId].text}
              />
            )}
          </>
        );
      })}
    </div>
  );
}
