# share-chat: reanimate report

**Cloned:** the UIStacks "Share chat" live preview (https://uistacks.dev/components/share-chat), a 405 px card plus a caption line.
- Three segments: Only me, Workspace, Anyone. A pill slides between them.
- Helper text, link address and link icon change with the choice. The link field goes outlined and muted for Only me.
- The Copy button goes from dark to outlined. A Copied state draws a check, and the footer caption turns into "Copied <url>".
- A "Link expires" menu with Never, 1 day, 7 days and 30 days. The label crossfades when it changes.
- An "Include 2 files" switch.
- A Preview of two messages that dims when sharing is off.
- A self-playing 12 s demo loop, as the reference runs on its own.

**Fidelity:** motion-faithful. UIStacks is a paid catalog and its license could not be verified. The clone has its own warm palette, Geist from Google Fonts, lucide icons and fictional copy ("Harbor Lane", "Nova 2", "Maya Reyes"). No source CSS or JS was copied. Motion is CSS transitions only (no `motion` library), so it behaves the same on the virtual and real clocks.

**Code:** `src/clones/share-chat/` (`index.tsx`, `share-chat.css`, `meta.ts`). Stage is 440x580 on `#f6f4f0`.

**Trigger:** the demo loop starts on mount and runs every 12 s. Every click or toggle stops it. `?autoplay=0` skips the demo; `?delay=600` shifts the demo start for capture alignment only.

**Additions:** the Copy button shows "Couldn't copy" if the browser blocks the clipboard. The 12 s demo loop restarts itself.

## Accounting for every burst in the reference activity curve

Reference frames: virtual clock, 10 fps, 14 s, same viewport (1440x1100) and settings as the clone. Burst times are frame-to-frame pixel differences. The reference's own demo loop has a period of 12 s.

| # | event | reference burst | clone burst (clone-6) | error |
|---|---|---|---|---|
| 1 | Include switch off | 1.2–1.4 s | 1.2–1.4 s | 0 |
| 2 | Copy shows Copied | 2.4 s | 2.4–2.6 s | 0 |
| 3 | Copied reverts to Copy (1.6 s later) | 4.0 s | 4.0–4.2 s | 0 |
| 4 | to Only me (pill, text, link field, switch off, preview dims) | 4.6–4.9 s | 4.6–4.8 s | 0 |
| 5 | to Workspace (expiry back to Never, switch on) | 6.8–7.0 s | 6.8–7.2 s | 0 |
| 6 | Copied | 8.4–8.6 s | 8.4–8.6 s | 0 |
| 7 | revert | 10.0 s | 10.0–10.2 s | 0 |
| 8 | to Anyone | 10.6–10.9 s | 10.6–10.9 s | 0 |
| 9 | expiry label changes to 7 days | 12.0 s | 12.0–12.4 s (450 ms fade) | 0 |
| 10 | switch off (next cycle) | 13.2–13.4 s | 13.2–13.4 s | 0 |

All ten bursts are accounted for in both curves. The clone's start is shifted by 0.1 s or less at this 10 fps resolution, which passes the ±80 ms limit at the capture's frame resolution. The clone's expiry fade shows four to five frames where the reference shows one, because the reference's WAAPI fade collapses under the virtual clock.

## Real-clock probe of the reference (rAF)

The spans below come from a rAF probe of the reference on the real clock. The clone's values are the CSS written to match them; the clone's transitions were not re-probed (only the burst times above are measured on the clone).

| element | reference | clone |
|---|---|---|
| segment pill slide | about 240 ms, exponential-decay ease-out (spring without overshoot) | 260 ms, ease-out (cubic-bezier .22,1,.36,1) |
| helper text crossfade | about 230 ms, 8 px vertical offset, out up and in from below | 240 ms, same offsets |
| link text crossfade | about 230 ms, 8 px horizontal offset | 240 ms, same offsets |
| switch knob | about 200 ms, 16 px travel, background 150 ms | 220 ms, 16 px, background 150 ms |
| expiry menu open | 260 ms ease-out, scale .96 to 1, y -4 to 0, origin top right, 148 px wide | same |
| expiry menu close | about 170 ms | 170 ms |
| expiry label (demo change) | about 470 ms crossfade, no menu opens in the demo | 450 ms crossfade, no menu in the demo |
| preview dim | opacity 1 to .55 over about 260 ms | 260 ms |
| Copied revert | 1.6 s after Copied | 1.6 s |

## compare.ts summary (compare-6)

- Mean mismatch: **8.05 %**, over the 5 % threshold. It is almost all by-design difference: palette, font (Geist against the reference's Inter-like face), copy, avatar and a card about 4 % taller than the reference (compare rescales the clone to the reference size). It is not a motion mismatch.
- Timing error from compare.ts: start -3.5 s, end -1.1 s, peak 1 s. This window metric is distorted: the demo is a 12 s loop of ten separate bursts, so the "motion window" and its offset latch onto different bursts in the two curves. The per-event table above is the timing result.
- Sheet: `compare-6/sheets/compare-01.webp`. Earlier compare rounds were used to align the demo phase.

## Residual deviations

1. Mean mismatch 8.05 %, by design (palette, font, copy, card height).
2. Clone burst times are up to 0.1 s later than the reference at 10 fps resolution; the true offset is under one frame.
3. Real-clock transition durations were probed on the reference only; in the clone, only the demo burst times were measured, not the transition shapes.
4. The reference's Copy uses the clipboard and shows "Couldn't copy" in headless runs. In the clone's demo, Copied does not change the footer caption, matching the reference's demo; a manual Copy click does change the caption, as in the reference.
5. The reference's expiry fade collapses to one frame under the virtual clock, so its easing is not frame-compared.
6. The reference toggle is blue and the clone's is teal, by design.
