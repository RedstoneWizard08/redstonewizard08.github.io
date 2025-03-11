import * as path from "@std/path";
import { get, writable } from "svelte/store";
import { termContent } from "../stores";
import { cwd, intrinsicCommands, vfs } from "./cmds";
import { splitToCommands } from "./parse";
import { htmlText, styled } from "./util";
import { canExecute } from "./perms";
import { gid, uid } from "./info";
import { readBinFile } from "./bin";

export const pathVar = writable<string>("/usr/bin:/usr/local/bin");

export const executeScript = (prompt: string, buf: string) => {
    const commands = splitToCommands(buf);

    termContent.update((v) => v + prompt + buf + "<br />");

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
            termContent.update(
                (v) =>
                    v + styled("color-red", "No command provided!") + "<br />"
            );

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
                if (item.type == "file" && item.name == cmd) {
                    if (canExecute(get(uid), get(gid), item)) {
                        try {
                            const bin = readBinFile(
                                vfs.read(`${fullPath}/${item.name}`)!.contents
                            );

                            const toExec = intrinsicCommands.get(bin);

                            if (toExec) {
                                toExec!(args);
                            } else {
                                termContent.update(
                                    (v) =>
                                        v +
                                        styled(
                                            "color-red",
                                            "Intrinsic command not found: " +
                                                bin
                                        ) +
                                        "<br />"
                                );
                            }
                        } catch (ex: unknown) {
                            termContent.update(
                                (v) =>
                                    v +
                                    styled(
                                        "color-red",
                                        "An error occured while executing: " +
                                            cmd
                                    ) +
                                    htmlText(`\n${ex}\n`)
                            );
                        }
                    } else {
                        termContent.update(
                            (v) =>
                                v +
                                styled("color-red", "Permission denied.") +
                                "<br />"
                        );
                    }

                    found = true;
                    break outer;
                }
            }
        }

        if (!found) {
            termContent.update(
                (v) =>
                    v +
                    styled("color-red", "Command not found: " + cmd) +
                    "<br />"
            );
        }
    }
};
