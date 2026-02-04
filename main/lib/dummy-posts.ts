export type Post = {
  id: string;
  title: string;
  status: "Draft" | "Scheduled" | "Published";
  platform: "LinkedIn";
};

export const posts: Post[] = [
  { id: "1", title: "How I grew my LinkedIn audience", status: "Published", platform: "LinkedIn" },
  { id: "2", title: "3 mistakes founders make", status: "Scheduled", platform: "LinkedIn" },
  { id: "3", title: "Why consistency beats talent", status: "Draft", platform: "LinkedIn" },
];
