import * as path from "@std/path";
import { get, writable } from "svelte/store";
import { termBuffer, termPrompt } from "../stores";
import { intrinsicCommands } from "./cmds";
import { splitToCommands } from "./parse";
import { canExecute } from "./perms";
import { cwd, gid, uid } from "./info";
import { readBinFile } from "./bin";
import { terminal } from "./terminal";
import { logError } from "./log";
import { vfs } from "./vfs";

export const pathVar = writable<string>("/usr/bin:/usr/local/bin");

export const executeScript = () => {
    const prompt = get(termPrompt);
    const buf = get(termBuffer);
    const commands = splitToCommands(buf);

    get(terminal).write("\r\n");

    for (const text of commands) {
        const args: string[] = [];

        let buf = "";
        let inString: false | "single" | "double" = false;

        for (const char of text) {
            if (inString == "double") {
                if (char == '"') {
                    inString = false;
                    continue;
                }

                buf += char;
                continue;
            } else if (inString == "single") {
                if (char == "'") {
                    inString = false;
                    continue;
                }

                buf += char;
                continue;
            }

            if (char == '"') {
                inString = "double";
            } else if (char == "'") {
                inString = "single";
            } else if (/\s/.test(char)) {
                args.push(buf.trim());
                buf = "";
                continue;
            } else {
                buf += char;
            }
        }

        if (buf.trim() != "") {
            args.push(buf.trim());
        }

        if (args.length <= 0) {
            logError("No command provided!");
            continue;
        }

        const cmd = args.shift()!;
        let found = false;

        outer: for (const dir of get(pathVar).split(":")) {
            const fullPath = dir.startsWith("/")
                ? path.normalize(dir)
                : path.normalize(get(cwd) + "/" + dir);

            const contents = vfs.readdir(fullPath) ?? [];

            for (const item of contents) {
                if ((item.type == "file" || item.type == "symlink") && item.name == cmd) {
                    if (canExecute(get(uid), get(gid), item)) {
                        try {
                            const bin = readBinFile(
                                vfs.read(`${fullPath}/${item.name}`)!.contents
                            );

                            const toExec = intrinsicCommands.get(bin);

                            if (toExec) {
                                toExec!(args);
                            } else {
                                logError(
                                    `Intrinsic command not found: \x1b[0m\x1b[1;36m${bin}`
                                );
                            }
                        } catch (ex: unknown) {
                            logError(
                                `An error occured during execution: \x1b[0m\r\n\x1b[1;36m${ex}`
                            );
                        }
                    } else {
                        logError("Permission denied.");
                    }

                    found = true;
                    break outer;
                }
            }
        }

        if (!found) {
            logError(`Command not found: ${cmd}`);
        }
    }

    get(terminal).write(prompt);
};
