interface Activity {
  id: number;
  title: string;
  description?: string;
  type: "crazy8" | "theme_sort" | "upvote" | "vote_results" | "gallery";
  order: number;
  activity_groups: StickyGroup[];
  stickies: Sticky[];
}
