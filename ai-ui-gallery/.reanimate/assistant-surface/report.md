# assistant-surface report (pixel-faithful, assistant-ui Assistant modal, MIT)
Capture: 1280x800, crop 734x309, 25 fps, virtual clock both sides, click on launcher.

| Row | Timing error | Mean mismatch | Easing | Result |
|---|---|---|---|---|
| close (dialog 200 ms, tooltip, icon swap) | start 0 s, end 0 s, dur 0 s, peak 0.04 s | 1.00% | same cubic-bezier(.32,.72,0,1); opacity samples match | PASS |
| open dialog 300 ms | clone opacity 0.14/0.72 at 17/67 ms vs ref 0.14/0.72 at 381/423 ms (42 vs 50 ms, within one frame) | n/a (ref open capture polluted by pre-js close; compared by track) | match | PASS |
| composer footer delay 100 ms | 100 ms, same curve | n/a | match | PASS |
Residual: ~1% static mismatch (text anti-aliasing, 1px icon edges); tooltip delay/fade approximated (~120 ms); launcher bg hover shade approximated; no ref capture of the open transition on the virtual clock because the click+pre-js sequence could not isolate it.
Sheet: `compare-4/sheets/compare-01.webp`.
