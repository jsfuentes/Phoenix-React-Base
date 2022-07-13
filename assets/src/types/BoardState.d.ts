interface Board {
  id: string;
  owner_id: string;
  title: string;
  description?: string;
  activities: Array<Activity>;
  stickies: Array<Sticky>;
}

interface BoardState {
  id: string;
  owner_id: string;
  title: string;
  description?: string;
  activities: Array<Activity>;
  stickies: Array<Sticky>;
  schedule_state: {
    activity_id: number;
    activity_start_time: string;
  };
}
