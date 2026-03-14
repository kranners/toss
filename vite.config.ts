import vitePluginWasm from "vite-plugin-wasm";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vitePluginWasm()],
});
