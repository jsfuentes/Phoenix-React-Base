interface Sticky {
  id: string;
  title: string;
  description?: string;
  image?: string;
  user_id: string;
  sticky_groups: string[];
  votes: Record<string, number>;
}
