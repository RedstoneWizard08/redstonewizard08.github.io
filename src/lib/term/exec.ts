import * as path from "@std/path";
import { get, writable } from "svelte/store";
import { termBuffer, termPrompt } from "../stores";
import { splitToCommands } from "./parse";
import { canExecute } from "./perms";
import { cwd, gid, uid } from "./info";
import { terminal } from "./terminal";
import { logError } from "./log";
import { vfs } from "./vfs";
import { evalScript, isScriptCommand } from "./swc";
import type { VFSEntry } from "$$/system/vfs";

export const pathVar = writable<string>("/usr/bin:/usr/local/bin");

export const executeScript = async () => {
    const prompt = get(termPrompt);
    const buf = get(termBuffer);
    const commands = splitToCommands(buf);

    get(terminal).write("\r\n");

    for (const text of commands) {
        await runCommand(text);
    }

    get(terminal).write(prompt);
};

export const runAs = async (targetUid: number, targetGid: number, text: string) => {
    const curUid = get(uid);
    const curGid = get(gid);

    uid.set(targetUid);
    gid.set(targetGid);

    await runCommand(text);

    uid.set(curUid);
    gid.set(curGid);
};

export const runCommand = async (text: string) => {
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
        return;
    }

    const cmd = args.shift()!;
    let found = false;

    outer: for (const dir of get(pathVar).split(":")) {
        const fullPath = dir.startsWith("/")
            ? path.normalize(dir)
            : path.normalize(get(cwd) + "/" + dir);

        let contents: VFSEntry[] = [];

        try {
            contents = vfs.readdir(fullPath);
        } catch (ex: any) {
            continue;
        }

        for (const item of contents) {
            if (
                (item.type == "file" || item.type == "symlink") &&
                item.name == cmd
            ) {
                if (canExecute(get(uid), get(gid), item)) {
                    const content = vfs.read(
                        `${fullPath}/${item.name}`
                    )!.contents;

                    try {
                        if (isScriptCommand(content)) {
                            const argv = [cmd, ...args];

                            await evalScript(
                                new TextDecoder().decode(content),
                                argv
                            );

                            found = true;
                            break outer;
                        } else {
                            logError(
                                `Could not figure out how to run file at ${fullPath}/${item.name}!`
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
};
