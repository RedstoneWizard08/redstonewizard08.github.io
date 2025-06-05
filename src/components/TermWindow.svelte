<script lang="ts">
    import "@xterm/xterm/css/xterm.css";
    import { onMount } from "svelte";
    import { setupTerminalWindow } from "../lib/term/setup";

    let win: HTMLDivElement;

    onMount(() => setupTerminalWindow(win));
</script>

<div bind:this={win} class="w-full h-full terminal"></div>

<style scoped>
    .terminal {
        font-family: "JetBrains Mono Variable", monospace;
        font-variant-ligatures: additional-ligatures;
    }
</style>
