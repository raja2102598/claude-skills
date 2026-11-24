import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// One page that plays every finished clone: `npm run build:showcase` → dist-showcase/.
export default defineConfig({
  root: "showcase",
  base: "./",
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "../dist-showcase",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: "assets/showcase.js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name][extname]",
      },
    },
  },
});
