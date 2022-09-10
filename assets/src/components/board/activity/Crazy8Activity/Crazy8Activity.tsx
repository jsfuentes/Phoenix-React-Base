import ActivityHeader from "src/components/Board/activity/ActivityHeader";
import UserCompletedStickies from "src/components/Board/Activity/Crazy8Activity/UserCompletedStickies";
import StickyNoteInput from "src/components/Board/Sticky/StickyNoteInput";

const debug = require("debug")("app:Crazy8Activity");

interface Crazy8ActivityProps {}

export default function Crazy8Activity(props: Crazy8ActivityProps) {
  return (
    <div className="flex flex-1 flex-col md:px-14 px-3 overflow-y-scroll">
      <ActivityHeader />
      <div className="w-full border-b border-gray-200 mt-2.5 relative">
        <div className="absolute border-b border-primary-500 top-0 left-0 w-16"></div>
      </div>
      <div className="flex-1 flex crazy8-sidebar-bp:flex-row flex-col gap-6 crazy8-sidebar-bp:gap-12 mt-4 md:mt-8">
        <div
          className="w-[32rem] flex-none md:block hidden"
          style={{ maxWidth: "100%" }}
        >
          <StickyNoteInput fullRounding={true} />
        </div>
        <UserCompletedStickies />
      </div>
    </div>
  );
}
