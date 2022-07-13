interface Board {
  id: string;
  owner_id: string;
  title: string;
  description?: string;
  activities: Array<Activity>;
  stickies: Array<Sticky>;
}

interface BoardState {
  board?: Omit<Board, "activities" | "stickies">;
  activities: {
    byId: Record<number, Activity>;
    allIds: number[];
  };
  stickies: {
    byId: Record<number, Sticky>;
    allIds: number[];
  };
  schedule_state?: {
    activity_id: number;
    activity_start_time: string;
  };
}
