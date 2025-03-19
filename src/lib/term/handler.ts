import { get } from "svelte/store";
import { termBuffer, termPrompt } from "../stores";
import { terminal } from "./terminal";
import { executeScript } from "./exec";
import type { ITerminal } from "@xterm/xterm/src/browser/Types";

export const handleTerminalData = async (ev: string) => {
    switch (ev) {
        case "\u0003":
            termBuffer.set("");
            get(terminal).write("^C");
            get(terminal).write(`\r\n${get(termPrompt)}`);
            break;
        case "\u001A":
            termBuffer.set("");
            get(terminal).write("^Z");
            get(terminal).write(`\r\n${get(termPrompt)}`);
            break;
        case "\u0009":
            termBuffer.update((v) => v + "\t");
            get(terminal).write("\t");
            break;
        case "\r":
            await executeScript();
            termBuffer.set("");
            break;
        // TODO
        // case "\x1b[D":
        //     alert("Left");
        //     break;
        // case "\x1b[C":
        //     alert("Right");
        //     break;
        // case "\x1b[A":
        //     alert("Up");
        //     break;
        // case "\x1b[B":
        //     alert("Down");
        //     break;
        case "\u007F":
            if (
                ((get(terminal) as any)._core as ITerminal).buffer.x >
                get(termPrompt).length
            ) {
                get(terminal).write("\b \b");

                if (get(termBuffer).length > 0) {
                    termBuffer.set(
                        get(termBuffer).slice(0, get(termBuffer).length - 1)
                    );
                }
            }
            break;
        default:
            if (
                (ev >= String.fromCharCode(0x20) &&
                    ev <= String.fromCharCode(0x7e)) ||
                ev >= "\u00a0"
            ) {
                termBuffer.update((v) => v + ev);
                get(terminal).write(ev);
            }
    }
};
