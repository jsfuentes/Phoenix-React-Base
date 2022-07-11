interface Activity {
  board_id: number;
  order: number;
  title: string;
  description: string;
  type: "crazy8" | "theme_sort" | "upvote";
}
