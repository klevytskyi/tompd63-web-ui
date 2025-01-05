import { createHtmlPlugin } from "vite-plugin-html";

/** @type {import('vite').UserConfig} */
export default {
  base: "",
  plugins: [createHtmlPlugin()],
};
