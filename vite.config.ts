import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const pagesHelper = (pages: string[]) =>
  Object.fromEntries(pages.map((page) => [page, `src/${page}/main.tsx`]));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        index: "index.html",
        ...pagesHelper(["react-virtualized"]),
      },
      output: {
        entryFileNames: "assets/[name].js",
      },
    },
  },
});
