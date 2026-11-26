export type Cat = "about" | "preferences" | "projects" | "people";
export const CATS: { id: Cat; label: string }[] = [
  { id: "about", label: "About you" },
  { id: "preferences", label: "Preferences" },
  { id: "projects", label: "Projects" },
  { id: "people", label: "People" },
];
export interface Mem {
  id: string;
  cat: Cat;
  text: string;
  date: string;
}
export const SEED: Mem[] = [
  { id: "role", cat: "about", text: "Works as a design lead on the payments team at Larkspur", date: "Sep 8" },
  { id: "city", cat: "about", text: "Lives in Lisbon and plans around Western European Time", date: "Sep 8" },
  { id: "cello", cat: "about", text: "Is learning the cello, about 25 minutes a day", date: "Oct 2" },
  { id: "short", cat: "preferences", text: "Wants the short answer first, with details after", date: "Sep 14" },
  { id: "diff", cat: "preferences", text: "Likes patch-style diffs when reviewing code", date: "Sep 20" },
  { id: "units", cat: "preferences", text: "Prefers metric units and 24 hour times", date: "Oct 5" },
  { id: "atlas", cat: "projects", text: "Is migrating the invoice service to Atlas Mini", date: "Oct 9" },
  { id: "deck", cat: "projects", text: "Is drafting the Q4 roadmap deck for the leadership review", date: "Oct 11" },
  { id: "sam", cat: "people", text: "Samira leads the data platform team and prefers async updates", date: "Oct 12" },
  { id: "joel", cat: "people", text: "Joel is the on-call lead for the billing service", date: "Oct 14" },
];
export const FRESH: Mem = { id: "fresh", cat: "preferences", text: "Prefers tabs over spaces in new files", date: "Today" };
