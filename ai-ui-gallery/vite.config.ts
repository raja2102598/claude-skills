import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "127.0.0.1",
    strictPort: false,
    // reanimate's raw captures (tens of thousands of frames) must not be watched: with many dev
    // servers running at once, watching them exhausted inotify and memory.
    watch: { ignored: ["**/.reanimate/**", "**/dist-showcase/**", "**/dist/**"] },
  },
});
