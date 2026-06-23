import * as vite from "vite";
import * as svelte_plugin from "@sveltejs/vite-plugin-svelte";

export default vite.defineConfig({
    plugins: [svelte_plugin.svelte()],
    server: { port: 5173 },
});
