import CompletedSticky from "src/components/board/activity/Crazy8Activity/CompletedSticky";

interface CompletedStickiesProps {
  selectedUserStickyGroup: StickyGroup;
  stickyIdToSticky: { [stickyId: string]: Sticky };
}

export default function CompletedStickies(props: CompletedStickiesProps) {
  return (
    <div className={"w-fit mb-4 flex flex-col flex-wrap gap-4"}>
      {props.selectedUserStickyGroup.sticky_ids.map((stickyId) => {
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
