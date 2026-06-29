import * as SvelteStore from "svelte/store";

import { Gallery } from "../../../../shared/interfaces/Gallery";

//

export const galleries: SvelteStore.Writable<Gallery[]> = SvelteStore.writable<Gallery[]>([]);

export const selected: SvelteStore.Writable<{
    type: "gallery" | "album" | "about" | "pricing";
    id?: string;
}> = SvelteStore.writable<{
    type: "gallery" | "album" | "about" | "pricing";
    id?: string;
}>({
    type: "gallery",
});

export const expanded: SvelteStore.Writable<Set<string>> = SvelteStore.writable<Set<string>>(
    new Set(),
);

export const currentLang: SvelteStore.Writable<string> = SvelteStore.writable("en");
