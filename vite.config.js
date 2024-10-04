import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: { "process.env": {} },
  resolve: {
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx"],
  },
  base: "/comicCollector-3000/",
});
