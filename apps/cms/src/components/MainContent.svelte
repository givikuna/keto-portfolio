<script>
    import GalleryEditor from "./GalleryEditor.svelte";
    import AlbumEditor from "./AlbumEditor.svelte";
    import MarkdownEditor from "./MarkdownEditor.svelte";

    import { selected } from "../lib/store";

    $: type = $selected.type;
    $: id = $selected.id;
</script>

<div class="main-content">
    {#if type === "gallery" && id}
        <GalleryEditor galleryId={id} />
    {:else if type === "album" && id}
        <AlbumEditor albumId={id} />
    {:else if type === "about"}
        <MarkdownEditor topic="about" />
    {:else if type === "pricing"}
        <MarkdownEditor topic="pricing" />
    {:else}
        <p>Select an item to edit.</p>
    {/if}
</div>

<style>
    .main-content {
        height: 100%;
    }
</style>
