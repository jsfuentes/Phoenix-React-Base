import React from "react";
import Masonry from "react-masonry-component";
import { getStickyColor } from "src/components/board/activity/stickyColors";
import VoteSticky from "src/components/board/activity/VoteActivity/VoteSticky";
import Button from "src/components/Button";

interface VoteGroupsProps {
  activityGroups: ActivityGroup[];
  stickyIdToSticky: { [stickyId: string]: Sticky };
}

export default function VoteGroups(props: VoteGroupsProps) {
  return (
    <div className={"flex-1 flex flex-col gap-5"}>
      {props.activityGroups.map((activityGroup, index) => {
        return (
          <div className={`rounded-md p-4 bg-${getStickyColor(index)}-100`}>
            <div
              className={`bg-${getStickyColor(
                index
              )}-200 inline-block rounded-2xl py-1 px-3 mb-3 font-medium text-${getStickyColor(
                index
              )}-800`}
            >
              {activityGroup.title}
            </div>
            <Masonry className={"w-full"}>
              {activityGroup.sticky_ids.map((stickyId) => {
                return (
                  <>
                    {stickyId in props.stickyIdToSticky && (
                      <VoteSticky
                        key={stickyId}
                        sticky={props.stickyIdToSticky[stickyId]}
                      />
                    )}
                  </>
                );
              })}
            </Masonry>
          </div>
        );
      })}
    </div>
  );
}
