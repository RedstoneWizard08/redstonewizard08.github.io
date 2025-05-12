import * as path from "@std/path";
import { get } from "svelte/store";
import { termBuffer, termPrompt } from "../stores";
import { splitToCommands } from "./parse";
import { canExecute } from "./perms";
import { cwd, env, fillEnv, gid, uid } from "./env";
import { terminal } from "./terminal";
import { logError } from "./log";
import { vfs } from "./vfs";
import { evalScript, isScriptCommand } from "./swc";
import type { VFSEntry } from "$$/system/vfs";

export const executeScript = async () => {
    const buf = get(termBuffer);
    const commands = splitToCommands(buf);

    get(terminal).write("\r\n");

    for (const text of commands) {
        await runCommand(text);
    }

    get(terminal).write(termPrompt());
};

export const runAs = async (
    targetUid: number,
    targetGid: number,
    text: string,
) => {
    const curUid = get(uid);
    const curGid = get(gid);

    uid.set(targetUid);
    gid.set(targetGid);

    await runCommand(text);

    uid.set(curUid);
    gid.set(curGid);
};

export const fixup = (input: string) =>
    fillEnv(
        input
            .replaceAll("\\x1b", "\x1b")
            .replaceAll("\\n", "\n")
            .replaceAll("\\r", "\r")
            .replaceAll("\\t", "\t")
            .replaceAll("\\e", "\e"),
    );

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
            args.push(fixup(buf));
            buf = "";
            continue;
        } else {
            buf += char;
        }
    }

    if (buf.trim() != "") {
        args.push(fixup(buf));
    }

    if (args.length <= 0) {
        logError("No command provided!");
        return;
    }

    const cmd = args.shift()!;
    const envPath = get(env).get("PATH");
    let found = false;

    if (!envPath) {
        logError("PATH variable not found!");
        return;
    }

    const fullPath = cmd.startsWith("/")
        ? path.normalize(cmd)
        : path.normalize(get(cwd) + "/" + cmd);

    if (vfs.exists(fullPath)) {
        const item = vfs.read(fullPath)!;
        const info = vfs.stat(fullPath) as VFSEntry;

        if (canExecute(get(uid), get(gid), info)) {
            const content = item.contents;

            try {
                if (isScriptCommand(content)) {
                    const argv = [cmd, ...args];

                    await evalScript(new TextDecoder().decode(content), argv);

                    return;
                } else {
                    logError(
                        `Could not figure out how to run file at ${fullPath}!`,
                    );
                }
            } catch (ex: unknown) {
                logError(
                    `An error occured during execution: \x1b[0m\r\n\x1b[1;36m${ex}`,
                );
            }
        } else {
            logError("Permission denied.");
        }

        return;
    }

    outer: for (const dir of envPath.split(":")) {
        const fullPath = dir.startsWith("/")
            ? path.normalize(dir)
            : path.normalize(get(cwd) + "/" + dir);

        let contents: VFSEntry[] = [];

        try {
            contents = vfs.readdir(fullPath);
        } catch (_ex: any) {
            continue;
        }

        for (const item of contents) {
            if (
                (item.type == "file" || item.type == "symlink") &&
                item.name == cmd
            ) {
                if (canExecute(get(uid), get(gid), item)) {
                    const content = vfs.read(
                        `${fullPath}/${item.name}`,
                    )!.contents;

                    try {
                        if (isScriptCommand(content)) {
                            const argv = [cmd, ...args];

                            await evalScript(
                                new TextDecoder().decode(content),
                                argv,
                            );

                            found = true;
                            break outer;
                        } else {
                            logError(
                                `Could not figure out how to run file at ${fullPath}/${item.name}!`,
                            );
                        }
                    } catch (ex: unknown) {
                        logError(
                            `An error occured during execution: \x1b[0m\r\n\x1b[1;36m${ex}`,
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
