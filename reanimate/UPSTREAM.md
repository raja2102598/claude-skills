# Upstream source

Source: [NiazMorshed2007/reanimate](https://github.com/NiazMorshed2007/reanimate/tree/3f7a55a2986a84ca2173e86ee9127eefe31d046d/skills/reanimate).

Commit: `3f7a55a2986a84ca2173e86ee9127eefe31d046d`. License: MIT; see [LICENSE](LICENSE).

The skill files match upstream. This folder adds this source record.

## Trap: pinned Playwright vs. a preinstalled Chromium

`scripts/package.json` pins `playwright@1.64.1`. On a machine whose Chromium was installed by a
different Playwright version (for example a Claude Code cloud container with Playwright 1.63.0 and
browsers in `/opt/pw-browsers`), `setup.sh` prints "chromium ok" only after downloading another
browser, and where downloads are blocked the capture fails with
`Executable doesn't exist at …/chromium_headless_shell-1248/…` and then `no video recorded`
(the video recorder also looks for a matching `ffmpeg-<rev>`).

Verified fix (24 Nov 2026): in the installed copy only, run
`bun add playwright@<preinstalled version>` inside `scripts/`. Symlinking the browser directory to
the expected revision makes Chromium launch, but the older ffmpeg then records no video.
