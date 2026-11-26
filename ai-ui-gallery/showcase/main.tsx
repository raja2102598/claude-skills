import { useEffect, useLayoutEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import "./showcase.css";
import { entries, type ShowcaseEntry } from "./clones";
import type { CloneMeta } from "../src/gallery/types";

type Loaded = ShowcaseEntry & { meta: CloneMeta };

/** Scales a fixed-size stage down to the available width; never up. */
function Scaled({ meta, children }: { meta: CloneMeta; children: ReactNode }) {
  const { width, height, background, dark } = meta.stage;
  const outer = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const el = outer.current!;
    const ro = new ResizeObserver(([entry]) => setScale(Math.min(1, entry.contentRect.width / width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);
  return (
    <div ref={outer} className="sc-frame" style={{ background }}>
      <div style={{ width: width * scale, height: height * scale, margin: "0 auto", position: "relative" }}>
        <div
          className={dark ? "sc-stage dark" : "sc-stage"}
          style={{ width, height, background, transform: `scale(${scale})`, transformOrigin: "0 0" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/** Mounts the clone the first time it scrolls into view, so its entrance plays while you watch. */
function LiveClone({ entry, run }: { entry: Loaded; run: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [Component, setComponent] = useState<ComponentType | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { rootMargin: "0px 0px -15% 0px" });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (seen && !Component) entry.load().then((m) => setComponent(() => m.default));
  }, [seen, Component, entry]);
  return (
    <div ref={ref}>
      <Scaled meta={entry.meta}>{Component ? <Component key={run} /> : <p className="sc-wait">Loading…</p>}</Scaled>
    </div>
  );
}

function Specimen({ entry }: { entry: Loaded }) {
  const [run, setRun] = useState(0);
  const { meta } = entry;
  const exact = meta.fidelity === "pixel-faithful";
  return (
    <section className="sc-specimen" id={entry.slug} aria-labelledby={`${entry.slug}-title`}>
      <header className="sc-head">
        <div className="sc-titles">
          <h2 id={`${entry.slug}-title`}>{meta.title}</h2>
          <span className={exact ? "sc-pill sc-pill-exact" : "sc-pill"}>{exact ? "pixel-faithful" : "motion-faithful"}</span>
        </div>
        <button type="button" className="sc-replay" onClick={() => setRun((r) => r + 1)}>
          Replay
        </button>
      </header>
      <dl className="sc-facts">
        <div><dt>Picked from</dt><dd>{entry.candidates} candidates</dd></div>
        <div><dt>Reference</dt><dd><a href={meta.sourceUrl} target="_blank" rel="noreferrer">{entry.reference}</a></dd></div>
        <div><dt>Runner-up</dt><dd>{entry.runnerUp}</dd></div>
        <div><dt>Verified</dt><dd>{entry.timing} · {entry.rounds} rounds</dd></div>
      </dl>
      {meta.pickedBecause && <p className="sc-why">{meta.pickedBecause}</p>}
      <LiveClone entry={entry} run={run} />
    </section>
  );
}

function App() {
  const [loaded, setLoaded] = useState<Loaded[] | null>(null);
  useEffect(() => {
    Promise.all(entries.map(async (e) => ({ ...e, meta: (await e.meta()).meta }))).then(setLoaded);
  }, []);
  useEffect(() => {
    const id = location.hash.slice(1);
    if (loaded && id) document.getElementById(id)?.scrollIntoView();
  }, [loaded]);

  return (
    <main className="sc-page">
      <header className="sc-intro">
        <p className="sc-eyebrow">reanimate · pick-ui-library</p>
        <h1>AI UI Gallery</h1>
        <p className="sc-lede">
          Agent and AI components rebuilt frame by frame. Each one beat every other catalog’s version of the same idea,
          then was recorded next to its reference and tuned until the timing matched.{" "}
          {loaded
            ? (() => {
                const concepts = new Set(loaded.map((e) => e.meta.concept)).size;
                return concepts >= 51
                  ? `${loaded.length} clones cover all 51 concepts.`
                  : `${loaded.length} clones cover ${concepts} of 51 concepts; the rest are still being cloned.`;
              })()
            : `${entries.length} clones.`}
        </p>
        <p className="sc-note">
          <strong>Motion-faithful</strong> clones match trigger, sequence, timing and easing, with original colours,
          fonts, icons and copy, because the reference is a paid component. <strong>Pixel-faithful</strong> clones also
          match the look, because the reference is open source. Each clone plays when it scrolls into view.
        </p>
        {loaded && (
          <nav className="sc-nav" aria-label="Clones">
            {loaded.map((e) => (
              <a key={e.slug} href={`#${e.slug}`}>{e.meta.title}</a>
            ))}
          </nav>
        )}
      </header>
      {loaded ? loaded.map((e) => <Specimen key={e.slug} entry={e} />) : <p className="sc-wait">Loading clones…</p>}
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
