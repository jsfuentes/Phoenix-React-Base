import Masonry from "react-masonry-component";
import { getStickyColor } from "src/components/board/activity/stickyColors";
import VoteSticky from "src/components/board/activity/VoteActivity/VoteSticky";

interface VoteGroupsProps {
  stickyGroups: StickyGroup[];
  stickyIdToSticky: { [stickyId: string]: Sticky };
}

export default function VoteGroups(props: VoteGroupsProps) {
  return (
    <div className={"flex-1 flex flex-col gap-5"}>
      {props.stickyGroups.map((stickyGroup, index) => {
        return (
          <div className={`rounded-md p-4 bg-${getStickyColor(index)}-100`}>
            <div
              className={`bg-${getStickyColor(
                index
              )}-200 inline-block rounded-2xl py-1 px-3 mb-3 font-medium text-${getStickyColor(
                index
              )}-800`}
            >
              {stickyGroup.title}
            </div>
            <Masonry className={"w-full"}>
              {stickyGroup.sticky_ids.map((stickyId) => {
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
