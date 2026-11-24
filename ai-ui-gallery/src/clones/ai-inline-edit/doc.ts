export type Op = { k: "keep" | "del" | "ins"; text: string };

export const TITLE = "Harbor Lights festival plan";
export const AFTER_PARAS = [
  "Volunteers in the east district has been asking for a lantern walk for over a year. Right now, if a family loses the trail in the middle of the dusk parade, the route just stops lighting and they have to start over when they get back to the pier, which is honestly a really confusing experience.",
  "The first night runs in three stages. Boat crews and 20 local vendors set up on the quay on Friday. We open the lantern walk to every ticket holder on Saturday if the weather stays clear, and the walk becomes a yearly event in the autumn.",
  "Stewards should expect questions about queues, where two groups arrives at the same gate while the tide is high. The map shows both routes and asks the last group to wait which one to take, so nobody is lost in the crowd.",
  "Next week we will",
];

/** The edited paragraph as a diff. Original = keep + del, result = keep + ins. */
export const OPS: Op[] = [
  { k: "keep", text: "Volunteers in the east district " },
  { k: "del", text: "has " },
  { k: "ins", text: "have " },
  { k: "keep", text: "been asking for a lantern walk for " },
  { k: "del", text: "over " },
  { k: "keep", text: "a year. " },
  { k: "del", text: "Right now, if " },
  { k: "ins", text: "Today, " },
  { k: "keep", text: "a " },
  { k: "keep", text: "family " },
  { k: "ins", text: "who " },
  { k: "keep", text: "loses the trail " },
  { k: "del", text: "in the middle of the dusk parade, " },
  { k: "ins", text: "mid parade loses " },
  { k: "keep", text: "the " },
  { k: "keep", text: "route " },
  { k: "del", text: "just stops lighting " },
  { k: "keep", text: "and " },
  { k: "del", text: "they have " },
  { k: "ins", text: "has " },
  { k: "keep", text: "to start " },
  { k: "del", text: "over when they get back to the pier, which is honestly a really confusing experience." },
  { k: "ins", text: "over." },
];

/** Tokens: the unit of streaming. Each keep/ins word and each del span is one tick. */
export interface Tok { op: number; text: string; k: Op["k"] }
export const TOKS: Tok[] = OPS.flatMap((o, i) =>
  o.k === "del"
    ? [{ op: i, text: o.text, k: o.k }]
    : o.text.split(/(?<= )/).filter(Boolean).map((w) => ({ op: i, text: w, k: o.k }))
);

/** change groups for the review count: each del/ins cluster */
export const CHANGES: number[][] = (() => {
  const g: number[][] = [];
  let cur: number[] | null = null;
  OPS.forEach((o, i) => {
    if (o.k === "keep") cur = null;
    else {
      if (!cur) { cur = []; g.push(cur); }
      cur.push(i);
    }
  });
  return g;
})();

export const COMMANDS = [
  { id: "shorten", label: "Shorten", doing: "Shortening", icon: "Minimize2" },
  { id: "clearer", label: "Make clearer", doing: "Clarifying", icon: "WandSparkles" },
  { id: "friendly", label: "Friendlier tone", doing: "Warming up", icon: "Smile" },
  { id: "formal", label: "More formal", doing: "Formalizing", icon: "Briefcase" },
  { id: "grammar", label: "Fix grammar", doing: "Proofreading", icon: "SpellCheck" },
] as const;
