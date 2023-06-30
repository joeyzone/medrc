import { defineConfig } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";
import mix from "vite-plugin-mix";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      components: path.resolve(__dirname, "src/components"),
      pages: path.resolve(__dirname, "src/pages"),
      assets: path.resolve(__dirname, "src/assets"),
    },
  },
  plugins: [
    vue(),
    mix({
      handler: "./server/index.js",
    }),
  ],
  define: {
    global: {},
  },
});
