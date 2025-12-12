import { createHtmlPlugin } from "vite-plugin-html";

/** @type {import('vite').UserConfig} */
export default {
  base: "",
  plugins: [createHtmlPlugin()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
};
