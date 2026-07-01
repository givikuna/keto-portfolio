<script lang="ts">
    import { onMount } from "svelte";

    import Sidebar from "./components/Sidebar.svelte";
    import MainContent from "./components/MainContent.svelte";

    import { galleries, currentLang } from "./lib/store";
    import { fetchGalleries } from "./lib/api";

    const langs: string[] = ["en", "ru", "ka"];

    onMount(async (): Promise<void> => {
        try {
            galleries.set(await fetchGalleries());
        } catch (e: unknown) {
            console.error("failed to load galleries", e);
        }
    });
</script>

<main class="cms-app">
    <header class="topbar">
        <h1>CMS</h1>
        <div class="lang-switcher">
            {#each langs as lang}
                <button
                    class:active={$currentLang === lang}
                    on:click={(): void => currentLang.set(lang)}
                >
                    {lang.toUpperCase()}
                </button>
            {/each}
        </div>
    </header>

    <div class="layout">
        <aside class="sidebar">
            <Sidebar />
        </aside>
        <section class="main">
            <MainContent />
        </section>
    </div>
</main>

<style>
    .cms-app {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }
    .topbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 1rem;
        background: #333;
        color: white;
    }
    .lang-switcher button {
        margin-left: 0.3rem;
        background: transparent;
        border: 1px solid white;
        color: white;
        padding: 0.2rem 0.5rem;
        cursor: pointer;
    }
    .lang-switcher button.active {
        background: #fff;
        color: #333;
    }
    .layout {
        display: flex;
        flex: 1;
        overflow: hidden;
    }
    .sidebar {
        width: 260px;
        border-right: 1px solid #ccc;
        overflow-y: auto;
    }
    .main {
        flex: 1;
        overflow-y: auto;
        padding: 1rem;
    }
</style>
