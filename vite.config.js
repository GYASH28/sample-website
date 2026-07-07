import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite config — fresh rebuild.
// Key constraint from the rebuild prompt: vendor/app code-split from the start.
// Target: app chunk well under 100 KB gzip on initial route.
export default defineConfig({
  plugins: [react()],
  build: {
    target: "es2022",
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Vendor chunk split: React/Router/DOM in one cacheable chunk,
        // Framer Motion + Lenis in another (animation libs are heavy but
        // rarely change), app code in its own chunk.
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "motion-vendor": ["framer-motion", "lenis"],
        },
      },
    },
  },
});
