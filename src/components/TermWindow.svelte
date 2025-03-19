<script lang="ts">
    import "@xterm/xterm/css/xterm.css";
    import { onMount } from "svelte";
    import { terminal } from "../lib/term/terminal";
    import { Terminal } from "@xterm/xterm";
    import { SearchAddon } from "@xterm/addon-search";
    import { WebglAddon } from "@xterm/addon-webgl";
    import { FitAddon } from "@xterm/addon-fit";
    import { WebLinksAddon } from "@xterm/addon-web-links";
    import { LigaturesAddon } from "../lib/ligatures/addon";
    import { handleTerminalData } from "../lib/term/handler";
    import { initTerminal } from "../lib/term/init";

    let win: HTMLDivElement;

    onMount(async () => {
        if ($terminal) $terminal.dispose();

        const search = new SearchAddon();
        const webgl = new WebglAddon();
        const links = new WebLinksAddon();
        const fit = new FitAddon();
        const ligatures = new LigaturesAddon();

        $terminal = new Terminal({
            fontFamily: '"JetBrains Mono Variable", monospace',
            customGlyphs: true,
            allowProposedApi: true,
            cursorBlink: true,
            cursorStyle: "bar",
            cursorInactiveStyle: "bar",
            disableStdin: false,
            fontWeight: "bold",
        });

        $terminal.open(win);
        $terminal.loadAddon(fit);
        $terminal.loadAddon(links);
        $terminal.loadAddon(search);
        $terminal.loadAddon(webgl);
        $terminal.loadAddon(ligatures);
        $terminal.onData(handleTerminalData);
        $terminal.focus();

        fit.fit();

        webgl.onContextLoss((_ev) => {
            webgl.dispose();
        });

        await initTerminal();
    });
</script>

<div bind:this={win} class="w-full h-full terminal"></div>

<style scoped>
    .terminal {
        font-family: "JetBrains Mono Variable", monospace;
        font-variant-ligatures: additional-ligatures;
    }
</style>
