import { getStickyColor } from "src/components/board/activity/stickyColors";
import VoteResult from "src/components/board/activity/VoteResultsActivity/VoteResult";
import Button from "src/components/Button";

interface VoteResultsListProps {
  stickyGroups: StickyGroup[];
  stickyIdToSticky: { [stickyId: string]: Sticky };
}

export default function VoteResultsList(props: VoteResultsListProps) {
  return (
    <div className="flex flex-col flex-1">
      <div className="flex justify-between mb-6">
        <div className="text-gray-400 font-medium text-xl">Voting Results</div>
        <Button variant="tertiary" icon="bx bx-copy" iconLeft={true}>
          Copy All
        </Button>
      </div>
      {props.stickyGroups.map((stickyGroup, index1) => {
        return stickyGroup.sticky_ids.map((stickyId, index2) => {
          return (
            <>
              {stickyId in props.stickyIdToSticky && (
                <VoteResult
                  key={stickyId}
                  stickyGroup={stickyGroup}
                  sticky={props.stickyIdToSticky[stickyId]}
                  color={getStickyColor(index1)}
                />
              )}
            </>
          );
        });
      })}
    </div>
  );
}
