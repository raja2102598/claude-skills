/* Demo data and timing for the agent-tasks clone. Copy is ours; timings come from .reanimate/agent-tasks/spec.md. */

export type Status = "queued" | "running" | "needs" | "failed" | "done";

export interface Step {
  /** Plan step, shown in the expanded panel. */
  label: string;
  /** Activity line that rolls into the subtitle while the step runs. */
  line: string;
}

export interface Diff {
  add: number;
  del: number;
  files: number;
  pr: number;
}

/** Linear ring fill: p(t) = p0 + (t - t0) * rate, rate per ms, clamped to [0, 1]. */
export interface Ring {
  p0: number;
  t0: number;
  rate: number;
}

export type PlanKind = "start" | "step" | "fail" | "done";

export interface Agent {
  id: string;
  title: string;
  repo: string;
  branch: string;
  steps: Step[];
  status: Status;
  /** Index of the current step (running / needs / failed); steps.length once done. */
  step: number;
  /** Run-clock ms at which the agent's timer read 0:00. */
  timerFrom: number;
  /** Seconds on the clock when the agent stopped (needs / failed), so a resume continues from there. */
  heldSeconds?: number;
  ring: Ring;
  /** Scheduled transitions, in run-clock ms. */
  plan: { at: number; kind: PlanKind }[];
  question?: { text: string; options: [string, string] };
  error?: string;
  diff: Diff;
  isNew?: boolean;
}

/** One step every 2.6 s (rows 4-5 of the spec). */
export const STEP_MS = 2600;
/** A queued agent starts 100 ms after a slot frees up (row 2). */
export const START_DELAY_MS = 100;
/** The ring starts filling ~109 ms after the agent starts (row 9). */
export const RING_LAG_MS = 109;
/** At most this many agents run at once; the rest wait in the queue. */
export const MAX_RUNNING = 3;

const step = (label: string, line = label): Step => ({ label, line });

/** The list at mount (t = 0 is the mount). */
export function initialAgents(): Agent[] {
  return [
    {
      id: "a1",
      title: "Speed up the search index",
      repo: "core/api",
      branch: "perf/search-index",
      steps: [
        step("Profile the slow queries", "Profile the slow queries"),
        step("Add a covering index", "Wait for the index build"),
        step("Re-run the benchmark", "Run the benchmark 20 times"),
        step("Open a pull request"),
      ],
      status: "running",
      step: 0,
      timerFrom: -48_000, // shows 0:48 at mount
      ring: { p0: 0.2377, t0: 0, rate: 0.07691 / 1000 },
      plan: [
        { at: 2000, kind: "step" },
        { at: 2000 + STEP_MS, kind: "step" },
        { at: 2000 + 2 * STEP_MS, kind: "step" },
        { at: 2000 + 3 * STEP_MS, kind: "done" },
      ],
      diff: { add: 31, del: 9, files: 4, pr: 218 },
    },
    {
      id: "a2",
      title: "Localize the onboarding flow",
      repo: "core/web",
      branch: "i18n/onboarding",
      steps: [
        step("Extract the strings"),
        step("Draft the translations"),
        step("Translate the legal copy"),
        step("Open a pull request"),
      ],
      status: "needs",
      step: 2,
      timerFrom: -71_000,
      heldSeconds: 71,
      ring: { p0: 0.5, t0: 0, rate: 0 },
      plan: [],
      question: { text: "Translate the legal pages too, or keep them in English?", options: ["Translate them", "Keep English"] },
      diff: { add: 212, del: 40, files: 11, pr: 219 },
    },
    {
      id: "a3",
      title: "Move cron jobs to the queue",
      repo: "core/jobs",
      branch: "chore/queue-cron",
      steps: [
        step("Map the existing jobs"),
        step("Port the nightly digest", "Port the nightly digest"),
        step("Run the job suite"),
        step("Open a pull request"),
      ],
      status: "running",
      step: 1,
      timerFrom: -132_000, // 2:12
      ring: { p0: 0.3256, t0: 0, rate: 0.09662 / 1000 },
      plan: [{ at: 1700, kind: "fail" }],
      error: "Worker crashed in jobs/digest.ts",
      diff: { add: 96, del: 58, files: 7, pr: 220 },
    },
    {
      id: "a4",
      title: "Upgrade the date library",
      repo: "core/web",
      branch: "chore/dates-v4",
      steps: [step("Bump the package"), step("Apply the codemod"), step("Run the build"), step("Open a pull request")],
      status: "done",
      step: 4,
      timerFrom: 0,
      ring: { p0: 1, t0: 0, rate: 0 },
      plan: [],
      diff: { add: 27, del: 11, files: 6, pr: 216 },
    },
    {
      id: "a5",
      title: "Write the changelog for 3.1",
      repo: "core/docs",
      branch: "docs/changelog-3-1",
      steps: [
        step("Collect merged changes"),
        step("Sort them by area"),
        step("Draft the entries"),
        step("Open a pull request"),
      ],
      status: "queued",
      step: 0,
      timerFrom: 0,
      ring: { p0: 0, t0: 0, rate: 0 },
      plan: [],
      diff: { add: 64, del: 0, files: 1, pr: 221 },
    },
  ];
}

const GENERIC_STEPS: Step[] = [
  step("Read the codebase"),
  step("Plan the change"),
  step("Edit the files"),
  step("Run the checks"),
];

let serial = 0;

/** A task typed into the composer. It waits in the queue until a slot is free. */
export function newAgent(title: string, pr: number): Agent {
  serial += 1;
  let h = 0;
  for (const ch of title) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return {
    id: `n${serial}-${h.toString(36)}`,
    title,
    repo: "core/web",
    branch: `agent/task-${serial}`,
    steps: GENERIC_STEPS,
    status: "queued",
    step: 0,
    timerFrom: 0,
    ring: { p0: 0, t0: 0, rate: 0 },
    plan: [],
    diff: { add: 8 + (h % 60), del: h % 9, files: 1 + (h % 5), pr },
    isNew: true,
  };
}

export function ringAt(r: Ring, t: number) {
  return Math.min(1, Math.max(0, r.p0 + (t - r.t0) * r.rate));
}

export function clockText(seconds: number) {
  const s = Math.max(0, seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
