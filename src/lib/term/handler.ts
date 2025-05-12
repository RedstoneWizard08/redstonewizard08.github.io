import { get } from "svelte/store";
import { termBuffer, termPrompt } from "../stores";
import { terminal } from "./terminal";
import { executeScript } from "./exec";
import type { ITerminal } from "@xterm/xterm/src/browser/Types";
import { inApp } from "./env.ts";

const ansiRegex = () => {
    const ST = "(?:\\u0007|\\u001B\\u005C|\\u009C)";

    const pattern = [
        `[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?${ST})`,
        "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))",
    ].join("|");

    return new RegExp(pattern, "g");
};

export const handleTerminalData = async (ev: string) => {
    if (get(inApp)) return;

    const prompt = termPrompt().replace(ansiRegex(), "");

    switch (ev) {
        case "\u0003":
            termBuffer.set("");
            get(terminal).write("^C");
            get(terminal).write(`\r\n${termPrompt()}`);
            break;
        case "\u001A":
            termBuffer.set("");
            get(terminal).write("^Z");
            get(terminal).write(`\r\n${termPrompt()}`);
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
                prompt.length
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
