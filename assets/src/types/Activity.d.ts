interface Activity {
  title: string;
  description: string;
  type: "crazy8" | "theme_sort" | "upvote";
  activity_groups: ActivityGroup[];
  stickies: Sticky[];
}
