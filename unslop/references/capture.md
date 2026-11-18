# Capture a baseline


1. **Look at the screen.** Find the files that render it. If you can run the app or open the file in a browser and take a screenshot, do it, so you judge what people see and not only the code.
   - Only a link to a live site, no code? Save the page with `node <skill folder>/scripts/snapshot.mjs <url> unslop/original.html` and work on a copy of that file. A local HTML file works in place of the URL. Add `--dark` or `--light` to match the theme the user sees. It also saves `original.live.png`, a screenshot of the live page, so render the saved copy and compare the two before you start. The script scrolls through the page first, so lazy-loaded sections and images are captured. Animated backgrounds drawn by scripts do not survive, so describe them in the audit from the live page.
   - Only a screenshot? Rebuild the screen as one static HTML file first, matching it closely, and treat that as the original.
   - In both cases the result is a redesigned page in code that the user can hand to whoever owns the real site, so say that in the report.
