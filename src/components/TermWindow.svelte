<script lang="ts">
    import "@xterm/xterm/css/xterm.css";
    import { onMount } from "svelte";
    import { termBuffer, termPrompt } from "../lib/stores";
    import { executeScript } from "../lib/term/exec";
    import { terminal } from "../lib/term/terminal";
    import { Terminal } from "@xterm/xterm";
    import { SearchAddon } from "@xterm/addon-search";
    import { WebglAddon } from "@xterm/addon-webgl";
    import { FitAddon } from "@xterm/addon-fit";
    import { WebLinksAddon } from "@xterm/addon-web-links";
    import { LigaturesAddon } from "../lib/ligatures/addon";
    import type { ITerminal } from "@xterm/xterm/src/browser/Types";

    let win: HTMLDivElement;
    
    // TODO: History
    // const history = [];
    // let historyPos = 0;

    onMount(() => {
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

        $terminal.onData((e) => {
            switch (e) {
                case "\u0003":
                    $termBuffer = "";
                    $terminal.write("^C");
                    $terminal.write(`\r\n${$termPrompt}`);
                    break;
                case "\u001A":
                    $termBuffer = "";
                    $terminal.write("^Z");
                    $terminal.write(`\r\n${$termPrompt}`);
                    break;
                case "\u0009":
                    $termBuffer += "\t";
                    $terminal.write("\t");
                    break;
                case "\r":
                    executeScript();
                    $termBuffer = "";
                    break;
                case "\u007F":
                    if (
                        (($terminal as any)._core as ITerminal).buffer.x >
                        $termPrompt.length
                    ) {
                        $terminal.write("\b \b");
                        if ($termBuffer.length > 0) {
                            $termBuffer = $termBuffer.slice(
                                0,
                                $termBuffer.length - 1
                            );
                        }
                    }
                    break;
                default:
                    if (
                        (e >= String.fromCharCode(0x20) &&
                            e <= String.fromCharCode(0x7e)) ||
                        e >= "\u00a0"
                    ) {
                        $termBuffer += e;
                        $terminal.write(e);
                    }
            }
        });

        $terminal.write($termPrompt);
        $terminal.focus();

        fit.fit();

        webgl.onContextLoss((_ev) => {
            webgl.dispose();
        });
    });
</script>

<div bind:this={win} class="w-full h-full terminal"></div>

<style scoped>
    .terminal {
        font-family: "JetBrains Mono Variable", monospace;
        font-variant-ligatures: additional-ligatures;
    }
</style>
