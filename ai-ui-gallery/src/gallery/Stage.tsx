import { useEffect, useState } from "react";
import type { CloneComponent, CloneMeta } from "./types";

type Loaded = { Component: CloneComponent; meta: CloneMeta } | null;

async function loadClone(slug: string): Promise<Loaded> {
  if (import.meta.env.DEV) {
    try {
      const [c, m] = await Promise.all([
        import(/* @vite-ignore */ `/src/clones/${slug}/index.tsx`),
        import(/* @vite-ignore */ `/src/clones/${slug}/meta.ts`),
      ]);
      return { Component: c.default, meta: m.meta };
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  return (await import("./prod-loader")).load(slug);
}

/**
 * /c/<slug>: the component alone, centred on a stage the size of the reference crop.
 * Capture it with `--selector "[data-stage]"`; the element gets data-ready once mounted.
 */
export function Stage({ slug }: { slug: string }) {
  const [state, setState] = useState<Loaded | "loading">("loading");
  useEffect(() => {
    loadClone(slug).then(setState);
  }, [slug]);

  if (state === "loading") return null;
  if (!state) return <p className="p-8 font-mono text-sm">No clone named “{slug}”.</p>;

  const { Component, meta } = state;
  const { stage } = meta;
  document.title = meta.title;
  return (
    <div
      className={stage.dark ? "dark" : undefined}
      style={{ minHeight: "100%", display: "grid", placeItems: "center", background: stage.background }}
    >
      <div
        data-stage
        data-ready
        style={{ width: stage.width, height: stage.height, position: "relative", background: stage.background, overflow: "hidden" }}
      >
        <Component />
      </div>
    </div>
  );
}
