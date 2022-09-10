interface BoardBasic {
  id: string;
  owner_id: string;
  title: string;
  prompt?: string;
  emoji?: string;
  description?: string;
  inserted_at: string;
  updated_at: string;
}

interface BoardState extends Partial<BoardBasic> {
  activities: {
    byId: Record<string, Activity>;
    allIds: string[];
  };
  stickies: {
    byId: Record<string, Sticky>;
    allIds: string[];
  };
  schedule_state?: ScheduleState;
}

interface ScheduleStateLive {
  status: "live";
  activity_id: string;
  activity_start_time: string;
}

type ScheduleState = ScheduleStateLive;

//this instead of enum to make importing easier without sacrificing types
type ScheduleStateStatus = ScheduleState["status"];
