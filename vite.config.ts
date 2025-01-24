import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const inputHelper = (inputs: string[]) =>
  Object.fromEntries(inputs.map((input) => [input, `src/${input}/main.tsx`]));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        index: "index.html",
        ...inputHelper(["react-virtuoso", "virtua"]),
      },
      output: {
        entryFileNames: "assets/[name].js",
      },
    },
  },
});
