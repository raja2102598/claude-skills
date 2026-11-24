import type { CloneMeta } from "./types";

const metas = import.meta.glob<{ meta: CloneMeta }>("../clones/*/meta.ts", { eager: true });
const clones = Object.entries(metas)
  .map(([path, { meta }]) => ({ slug: path.split("/").at(-2)!, meta }))
  .sort((a, b) => a.meta.concept.localeCompare(b.meta.concept) || a.slug.localeCompare(b.slug));

export function Gallery() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 font-sans text-neutral-900">
      <h1 className="text-2xl font-semibold tracking-tight">AI UI Gallery</h1>
      <p className="mt-2 max-w-2xl text-sm text-neutral-600">
        Agent and AI components cloned with reanimate from the pick-ui-library catalog, one pick per concept.
        Open a card to see the clone on its capture stage.
      </p>
      {clones.length === 0 ? (
        <p className="mt-10 text-sm text-neutral-500">No clones yet.</p>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clones.map(({ slug, meta }) => (
            <li key={slug} className="rounded-xl border border-neutral-200 p-4">
              <a href={`/c/${slug}`} className="font-medium hover:underline">{meta.title}</a>
              <p className="mt-1 text-xs text-neutral-500">
                {meta.concept} · {meta.fidelity} · from{" "}
                <a className="underline" href={meta.sourceUrl} target="_blank" rel="noreferrer">{meta.source}</a>
              </p>
              {meta.pickedBecause && <p className="mt-2 text-sm text-neutral-600">{meta.pickedBecause}</p>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
