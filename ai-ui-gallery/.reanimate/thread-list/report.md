# thread-list — reanimate report

**Cloned:** UIStacks "Conversation list" (https://uistacks.dev/components/conversation-list), the live preview. It is a 300x422 panel (the reference renders it with CSS `zoom: .92`, so 276x388 on the page).
- Groups: Pinned, Today, Yesterday, Previous 7 days.
- A model mark on every row.
- A search box that filters as you type, with a "No chats match" state.
- Hover actions on each row: pin, rename, delete.
- Inline rename with the text pre-selected.
- A New chat button that adds a row at the top of Today.
- A delete that fades the row, collapses it, and shows a "Deleted · title / Undo" toast at the bottom of the panel. The toast appears together with the fade and slides out when Undo is pressed.

**Fidelity:** motion-faithful. UIStacks is a paid catalog and its license could not be verified. The clone uses its own warm palette, Geist from Google Fonts, lucide icons and own model marks (Nova, Atlas, Orbit and Kite are fictional). Titles are fictional and no copy was taken from the source.

**Code:** `src/clones/thread-list/` (`index.tsx`, `thread-list.css`, `meta.ts`). Stage is 420x520 on `#f6f4f0`.

**Trigger:** the demo plays once on mount, and the list stays live afterwards. The demo hovers a row, deletes it, undoes the delete, adds a new chat, then types "oat" in the search box and clears it. `?autoplay=0` skips the demo.

**Additions:**
- Arrow-key navigation between rows.
- Esc cancels a rename, and blur commits it.
- Pin and unpin moves a row between Pinned and Today.
- A clear (x) button in the search box.
- The toast auto-dismisses after 5 s.

## Verification (re-check)

The first build was verified only lightly (two rows timed, no frame compare). This re-check captured both sides the same way, ran a frame compare, probed every motion row on the real clock, and made one fix round.

**Setup**
- Both sides use viewport 1280x1100, `--clock virtual`, 25 fps and 4.6 s.
- The crop is 420x520, taken with `--clip 430,467,420,520` on the reference and `[data-stage]` on the clone. The clone loads `?autoplay=0`.
- The same `--pre-js` drives both sides, with `--wait-before 5300`: delete the 4th row at +0.3 s, click Undo at +2.3 s, click New chat at +3.3 s.
- The reference runs its own looping demo (new chat, typed title, pin, reset, about 12 s period). The 5.3 s wait moves the capture past it.
- The reference's motion-library animations are driven by WAAPI, which the virtual clock does not run. So the virtual-clock reference frames are good for sequence and layout but not for durations. All timings and easings below come from real-clock rAF probes on both sides, with the page loaded for 16 s on the reference and 5 s on the clone.

**Frame compare (virtual clock, `compare-4`, 116 of 121 frames)**
- **Mean mismatch: 3.86 %.** It passes the 5 % motion-faithful threshold. It is dominated by differences in palette, font, copy, panel scale (0.92 vs 1.0) and the reference's surrounding chrome (the mode toggle, the caption line).
- Sheet: `compare-4/sheets/compare-01.webp`.
- **Timing error by onset, clone minus reference** (the compare's own start/end/duration figures are distorted by reference tails, described below):

| event | reference first change | clone first change | onset error |
|---|---|---|---|
| delete | frame 8 (0.32 s) | frame 6–7 (0.24–0.28 s) | about -0.04 to -0.08 s |
| undo | frame 58 (2.32 s) | frame 56 (2.24 s) | -0.08 s |
| new chat | frame 83 (3.32 s) | frame 81 (3.24 s) | -0.08 s |

- The compare script's own figures were: start -0.04 s, end -0.52 s, duration -0.48 s (listed FAIL, limit 0.08 s). The end and duration errors come from reference tails, not from the clone finishing early: faint reference activity to frame 23 after delete; 0.4 s of undo activity against 0.2 s; 0.44 s of new-chat activity against 0.2 s (partly the placeholder mark in the reference's new row fading in, partly virtual-clock handling of WAAPI). The sheets show both sides' rows finishing at about the same time.
- Every burst in the reference's activity curve is accounted for: frame 2 (a hover or state flick before the delete); frames 8–23 (delete fade, collapse, toast, caption change); frames 58–67 (undo, the row growing back and the toast leaving); frames 83–93 (new chat grow, the placeholder mark settling and the caption changing). The clone has one burst per event at the same moments.

**Real-clock probe, per event** (`t` is ms after the first visible change; heights are normalised to the row's full height; the reference row is 33 px and the clone's is 36 px)

| # | row | reference | clone, before the fix | clone, after the fix | result |
|---|---|---|---|---|---|
| 1 | delete: row opacity 1→0 | 0.84 at +13, 0.54 at +47, 0.19 at +107, 0 at about +160; near-linear | ease-out, 190 ms, 0 at about +166 | linear, 165 ms; 0.9 at +6, 0.49 at +73, 0 at +157 | PASS (±10 ms) |
| 2 | delete: height collapse, rows below shift up | starts +83 ms, 0 at +296; ease-out-ish, 0.46 at +157 | 160 ms delay, ends +380 (+80 ms late) | 85 ms delay, 215 ms ease-out; ends +290 | PASS (-6 ms) |
| 3 | delete: toast appears | immediately with the fade; opacity 0→1 in about 215 ms, slides about 44 px up in about 110 ms | after the row left the list, +390 ms late; 8 px slide, 170 ms | immediate; opacity ease-out 210 ms (0.13 at +6, 0.57 at +80, 1 at +190), `translateY(44px)→0` 120 ms | PASS (was FAIL, +390 ms) |
| 4 | undo: row grows back, height and opacity together | 0.05 at +25, 0.29 at +57, 0.55 at +91, 0.77 at +141, 0.99 at +231; ease-in-out start, about 230 ms | ease-out, 0.12 at +4, ended +205 | `cubic-bezier(.4,0,.2,1)`, 230 ms; 0.06 at +22, 0.34 at +55, 0.68 at +89, 0.95 at +155, 1 at +205 | PASS (about -10 ms mid-curve) |
| 5 | undo: toast leaves | fades 1→0 over about 230 ms, slides 44 px down on a lagging ease-in-out curve | removed instantly | opacity ease-out 230 ms, `translateY` 44 px with `cubic-bezier(.4,0,.3,1)` 230 ms | PASS (was FAIL, instant) |
| 6 | new chat: row grows 0→full height with opacity 0→1, rows below pushed | 0.02 at +11, 0.27 at +54, 0.53 at +87, 0.74 at +121, 0.92 at +168, 0.99 at +219; 232 ms | ease-out, 0.53 at +66 (front-loaded) | `cubic-bezier(.4,0,.2,1)`, 230 ms; 0.06 at +29, 0.34 at +61, 0.68 at +95, 0.95 at +160, 1 at +211 | PASS |
| 7 | hover actions (pin, rename, delete) fade in | CSS transition, width 0→auto | 120 ms ease-out | unchanged | not frame-measured |
| 8 | search filter, "No chats match", rename, selection pill | observed | same | unchanged | behaviour / visual only |

**Easing per row:** row fade linear 165 ms; collapse ease-out 215 ms after an 85 ms delay; grow (new chat and undo) `cubic-bezier(.4,0,.2,1)` 230 ms; toast in opacity ease-out 210 ms plus a fast `cubic-bezier(.22,1,.36,1)` 44 px slide over 120 ms; toast out opacity ease-out 230 ms plus a `cubic-bezier(.4,0,.3,1)` 44 px slide over 230 ms.

**Fix round (one)**
- Delete now shows the toast on click and removes the row from state at 310 ms (it was 390 ms with the toast after).
- Undo now plays the toast's exit instead of removing it instantly, and skips the insert if the row is still in the list.
- The grow easing changed from ease-out to `cubic-bezier(.4,0,.2,1)`.
- The toast slide distance changed from 8 px to 44 px.

## Residual deviations

1. Virtual-clock timing errors at the end of each burst (end -0.52 s, duration -0.48 s by `compare.ts`) are measurement artefacts. The reference's WAAPI tails, and its placeholder mark in the new row, last about 0.2 s longer than the clone's. The real-clock probes show the clone ending within 10 ms of the reference on every row.
2. Event onsets in the virtual capture are 0.04–0.08 s early in the clone, at the ±80 ms limit, probably from timer and event ordering under the virtual clock. The real-clock probes show first change within about 15 ms of the reference.
3. The reference's new-chat row begins with a pale dashed placeholder mark that settles over about 0.2 s. The clone shows its model mark immediately (kept to preserve the existing styling).
4. Row height is 33 px in the reference against 36 px in the clone, and the panel scale is 0.92 against 1.0. The clone keeps its own layout proportions, so only normalised values are compared.
5. Hover-action fade (120 ms), rename, search behaviour and pin animation were not frame-measured. Pin, rename-commit and keyboard behaviour are additions.
6. The reference page loads slowly and loops its own demo with a period of about 12 s. Probes use `domcontentloaded`, with a 16 s wait on the reference.
7. Palette, font, marks and copy differ by design. The reference's surrounding chrome (mode toggle, caption line) is not part of the clone.
