import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
 plugins: [solidPlugin()],
 build: {
  lib: {
   entry: "src/index.ts",
   name: "solidhelper", // UMD global name
   formats: ["es", "cjs"], // Build ESM and CommonJS
   fileName: (format) => `index.${format}.js`,
  },
  rollupOptions: {
   // Exclude solid-js to avoid bundling it
   external: ["solid-js"],
   output: {
    globals: {
     "solid-js": "SolidJS",
    },
   },
  },
 },
});
