import { SvelteComponent } from "svelte";

import App from "./App.svelte";

const app: SvelteComponent<Record<string, any>, any, any> = new App({
    target: document.body,
});

export default app;
