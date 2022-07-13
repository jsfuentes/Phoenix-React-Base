interface Activity {
  id: number;
  title: string;
  description?: string;
  type: "crazy8" | "theme_sort" | "upvote" | "vote_results";
  order: number;
  activity_groups: ActivityGroup[];
  stickies: Sticky[];
}
