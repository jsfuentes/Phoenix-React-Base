interface Board {
  id: string;
  owner_id: string;
  title: string;
  description?: string;
}

interface BoardState extends Board {
  schedule_state: {
    activity_id: number;
    activity_start_time: string;
  };
}
