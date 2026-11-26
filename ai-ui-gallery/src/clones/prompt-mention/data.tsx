import { Feather, Flame, Lightbulb, ListTodo, MessageSquareWarning, Sparkles, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/* Fictional commands, agents and people. Names are chosen so the demo's filters narrow the list the way the
   reference's do: "/" 3 → "/c" 2 → "/ch" 1; "@" 6 → "@V" 2 → "@Ve" 1; "@" 6 → "@M" 3 (two groups) → "@Ma" 2 → "@Mar" 1. */

export type Trigger = "/" | "@";

export interface Item {
  id: string;
  trigger: Trigger;
  group: string;
  /** Inserted after the trigger character. */
  name: string;
  sub: string;
  icon: ReactNode;
}

const glyph = (Icon: LucideIcon, color?: string) => (
  <Icon size={20} strokeWidth={1.5} aria-hidden="true" style={color ? { color } : undefined} />
);

const avatar = (initials: string, bg: string, fg: string) => (
  <span className="pm-avatar" style={{ background: bg, color: fg }} aria-hidden="true">
    {initials}
  </span>
);

export const ITEMS: Item[] = [
  { id: "checklist", trigger: "/", group: "Commands", name: "checklist", sub: "Turn a thread into to-dos", icon: glyph(ListTodo) },
  { id: "critique", trigger: "/", group: "Commands", name: "critique", sub: "Find the weak spots in a draft", icon: glyph(MessageSquareWarning) },
  { id: "explain", trigger: "/", group: "Commands", name: "explain", sub: "Say it in plain words", icon: glyph(Lightbulb) },

  { id: "ember", trigger: "@", group: "Agents", name: "Ember", sub: "Agent · Planning", icon: glyph(Flame, "#d9692b") },
  { id: "nova", trigger: "@", group: "Agents", name: "Nova", sub: "Agent · Deep research", icon: glyph(Sparkles, "#7a5cd6") },
  { id: "vesper", trigger: "@", group: "Agents", name: "Vesper", sub: "Agent · Drafting", icon: glyph(Feather, "#2f8a78") },

  { id: "iris", trigger: "@", group: "People", name: "Iris Chen", sub: "Design lead", icon: avatar("IC", "#f1dcc8", "#7a4a22") },
  { id: "marlon", trigger: "@", group: "People", name: "Marlon Hale", sub: "Finance", icon: avatar("MH", "#d6e4f2", "#2c4f73") },
  { id: "tomas", trigger: "@", group: "People", name: "Tomas Berg", sub: "Customer support", icon: avatar("TB", "#dcebd5", "#3e6630") },
];

export const GROUP_LABEL: Record<Trigger, string> = { "/": "Commands", "@": "Mentions" };
