export interface Thought {
  id: string;
  label: string;
  score: number;
  children?: Thought[];
}

export const QUESTION = "Which launch plan holds up by Friday?";
export const MODEL = "Nova 2";

export const TREE: Thought[] = [
  {
    id: "a", label: "Trim to core", score: 0.82, children: [
      { id: "a1", label: "Freeze Wednesday", score: 0.86, children: [
        { id: "a1a", label: "Ship Thursday", score: 0.9 },
        { id: "a1b", label: "Ship Friday 09:00 sharp", score: 0.71 },
      ] },
      { id: "a2", label: "Skip manual QA", score: 0.31, children: [
        { id: "a2a", label: "Spot-check only", score: 0.35 },
        { id: "a2b", label: "Test on staging", score: 0.48 },
      ] },
    ],
  },
  {
    id: "b", label: "Hire contractors", score: 0.38, children: [
      { id: "b1", label: "Onboard in a day", score: 0.45, children: [
        { id: "b1a", label: "Pair with owners", score: 0.5 },
        { id: "b1b", label: "Review every diff", score: 0.42 },
      ] },
      { id: "b2", label: "Split the backlog", score: 0.52, children: [
        { id: "b2a", label: "Two tracks, one gate", score: 0.57 },
        { id: "b2b", label: "Freeze the interface", score: 0.61 },
      ] },
    ],
  },
  {
    id: "c", label: "Gate risky features", score: 0.74, children: [
      { id: "c1", label: "Dark launch first", score: 0.66, children: [
        { id: "c1a", label: "Mirror live traffic", score: 0.58 },
        { id: "c1b", label: "Enable for staff", score: 0.62 },
      ] },
      { id: "c2", label: "Stage the rollout", score: 0.79, children: [
        { id: "c2a", label: "10% first, all Friday", score: 0.94 },
        { id: "c2b", label: "Roll back on error", score: 0.87 },
      ] },
    ],
  },
];
