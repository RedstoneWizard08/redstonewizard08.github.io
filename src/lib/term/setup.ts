import { get } from "svelte/store";
import { terminal } from "./terminal.ts";
import { SearchAddon } from "@xterm/addon-search";
import { WebglAddon } from "@xterm/addon-webgl";
import { WebLinksAddon } from "@xterm/addon-web-links";
import { FitAddon } from "@xterm/addon-fit";
import { LigaturesAddon } from "../ligatures/addon.ts";
import { Terminal } from "@xterm/xterm";
import { initTerminal } from "./init.ts";
import { handleTerminalData } from "./handler.ts";

declare global {
    interface Window {
        onLoadFinish?: () => void;
    }
}

export const setupTerminalWindow = async (element: HTMLElement) => {
    if (get(terminal)) get(terminal).dispose();

    const search = new SearchAddon();
    const webgl = new WebglAddon();
    const links = new WebLinksAddon();
    const fit = new FitAddon();
    const ligatures = new LigaturesAddon();

    terminal.set(
        new Terminal({
            fontFamily: '"JetBrains Mono Variable", monospace',
            customGlyphs: true,
            allowProposedApi: true,
            cursorBlink: true,
            cursorStyle: "bar",
            cursorInactiveStyle: "bar",
            disableStdin: false,
            fontWeight: "bold",
            convertEol: true,
        })
    );

    get(terminal).open(element);
    get(terminal).loadAddon(fit);
    get(terminal).loadAddon(links);
    get(terminal).loadAddon(search);
    get(terminal).loadAddon(webgl);
    get(terminal).loadAddon(ligatures);
    get(terminal).onData(handleTerminalData);
    get(terminal).focus();

    fit.fit();

    webgl.onContextLoss((_ev) => {
        webgl.dispose();
    });

    window.onLoadFinish?.();

    await initTerminal();
};
