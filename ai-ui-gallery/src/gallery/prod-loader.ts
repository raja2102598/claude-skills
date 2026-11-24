import type { CloneComponent, CloneMeta } from "./types";

// Production build only. In dev, Stage loads one clone by URL so that adding or editing
// another clone never hot-reloads a page that is being captured.
const components = import.meta.glob<{ default: CloneComponent }>("../clones/*/index.tsx");
const metas = import.meta.glob<{ meta: CloneMeta }>("../clones/*/meta.ts");

export async function load(slug: string) {
  const c = components[`../clones/${slug}/index.tsx`];
  const m = metas[`../clones/${slug}/meta.ts`];
  if (!c || !m) return null;
  const [{ default: Component }, { meta }] = await Promise.all([c(), m()]);
  return { Component, meta };
}
