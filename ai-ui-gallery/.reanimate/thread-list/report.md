# thread-list — reanimate report

**Cloned:** UIStacks "Conversation list" (https://uistacks.dev/components/conversation-list), the live preview. It is a 300x422 panel.
- Groups: Pinned, Today, Yesterday, Previous 7 days.
- A model mark on every row.
- A search box that filters as you type, with a "No chats match" state.
- Hover actions on each row: pin, rename, delete.
- Inline rename with the text pre-selected.
- A New chat button that adds a row at the top of Today.
- A delete that fades the row, collapses it, and shows a "Deleted · title / Undo" toast at the bottom of the panel.

**Fidelity:** motion-faithful. UIStacks is a paid catalog and its license could not be verified. The clone uses its own warm palette, Geist from Google Fonts, lucide icons and own model marks (Nova, Atlas, Orbit and Kite are fictional). Titles are fictional and no copy was taken from the source.

**Code:** `src/clones/thread-list/` (`index.tsx`, `thread-list.css`, `meta.ts`). Stage is 420x520 on `#f6f4f0`.

**Trigger:** the demo plays once on mount, and the list stays live afterwards. The demo hovers a row, deletes it, undoes the delete, adds a new chat, then types "oat" in the search box and clears it. `?autoplay=0` skips the demo.

**Additions:**
- Arrow-key navigation between rows.
- Esc cancels a rename, and blur commits it.
- Pin and unpin moves a row between Pinned and Today.
- A clear (x) button in the search box.
- The toast auto-dismisses after 5 s.

## Verification (lighter than most clones)

Two rounds: round 1 was a virtual-clock capture and a real-clock probe; round 2 was a real-clock probe of the delete and new-chat rows, plus a re-capture. The reference's motion-library WAAPI animations do not run under the virtual clock, so the motion rows were measured with real-clock rAF probes of the reference and the clone, not with a virtual-clock frame diff. **Only rows 1–3 are timed against the reference; there is no compare sheet.**

| # | row | reference | clone (final) | result |
|---|---|---|---|---|
| 1 | delete: row fade 1→0 | click at about 490 ms, opacity 0.50 at +54 ms, 0 at +160 ms, ease-out | 190 ms ease-out, opacity 0.29 at +72 ms | PASS (within ±80 ms) |
| 2 | delete: collapse height 33→0, rows below shift up | finishes at about +300 ms | finishes at about +380 ms (160 ms delay + 230 ms) | PASS (+80 ms, at the limit) |
| 3 | new chat: row grows 0→full height with opacity 0→1, rows below pushed | 220 ms, ease-out; 0.39 of height at +70 ms, 0.97 at +200 ms | 230 ms ease-out; 0.53 at +66 ms, 1.0 at +200 ms | PASS |
| 4 | hover actions (pin, rename, delete) fade in | CSS transition, width 0→auto | 120 ms ease-out | not frame-measured |
| 5 | toast "Deleted · title / Undo" slides up from the bottom of the panel | present at the end of the delete | 220 ms ease-out slide-up, 140 ms out | existence only |
| 6 | search filters across all groups, with "No chats match" state | observed in screenshots | same | behaviour |
| 7 | rename: inline input, text selected, Enter commits | observed | same | behaviour |
| 8 | selection: white pill on the active row | observed | same | visual |

**Mean pixel mismatch:** not measured. Palette, font and copy differ by design.

## Residual deviations

1. Delete collapse ends about 80 ms later than the reference (about 380 ms against about 300 ms), because of the fade-then-collapse chaining. It is at the ±80 ms limit.
2. New-chat growth shape is slightly front-loaded: 0.53 at +66 ms against 0.39 in the reference. It ends 12 ms earlier.
3. Only the delete and new-chat rows were probed on the real clock. Hover fade, toast easing and rename were matched by observation and CSS values, not by frame diff.
4. The reference page was flaky to load (networkidle timeouts), so probes use `domcontentloaded` with a 6 s wait.
5. The reference's row height is 33 px in the probe against 36 px in the clone (36 px row plus 2 px gap in the clone). The clone keeps its own layout proportions rather than the probed sizes.
6. Not verified in the reference: whether the preview scrolls, and how pin and unpin animate. Pin, rename-commit and keyboard behaviour in the clone are additions.
7. Palette, font, marks and copy differ by design.
