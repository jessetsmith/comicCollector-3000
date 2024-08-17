import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        format: "es", // Ensure ES module format
      },
    },
  },
});
