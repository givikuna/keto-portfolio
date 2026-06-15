import { defineConfig } from "astro/config";

export default defineConfig({
    root: "./apps/web/src",
    outDir: "./apps/web/dist",
    publicDir: "./apps/web/public",
    server: {
        port: 8081,
    },
});
