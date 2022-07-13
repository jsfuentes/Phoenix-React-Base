import { useAppSelector } from "src/redux/hooks";

interface VoteSidebarProps {
  activity_groups: StickyGroup[];
}

export default function VoteSidebar(props: VoteSidebarProps) {
  //  Merge this with the crazy 8 sidebar?
  // TODO: read name from this thing
  const attendeesById = useAppSelector(
    (state) => state.presence.attendees.byId
  );
  // TODO: horizontal overflow (long names)
  // TODO: vertical overflow (many users)
  return (
    <div className="w-60 flex-none bg-gray-100 h-full flex flex-col border-l border-l-gray-200">
      {props.activity_groups.map((activity_group: StickyGroup) => (
        <div className="flex justify-between px-3 py-2 border-b border-b-gray-200">
          <div
            className={"text-gray-500"}
          >{`User ${activity_group.user_id}`}</div>
          <div className={"text-gray-400"}>2 votes left</div>
        </div>
      ))}
    </div>
  );
}
