import * as marked from "marked";

//

export function renderMarkdown(md: string): string {
    return marked.marked.parse(md) as string; // i might want to read the docs for this in detail huh
}
