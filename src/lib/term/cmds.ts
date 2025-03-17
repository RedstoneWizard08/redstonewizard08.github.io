import { get } from "svelte/store";
import { vfs } from "./vfs";
import * as path from "@std/path";
import { terminal } from "./terminal";
import { logError, println } from "./log";
import { cwd } from "./info";
import type { VFSEntry } from "$$/system/vfs";
import { printPermissions } from "./perms";

export type CommandExecutor = (args: string[]) => void | Promise<void>;

export const intrinsicCommands: Map<string, CommandExecutor> = new Map();

const clear = () => {
    get(terminal).clear();
};

const ls = (args: string[]) => {
    args = args.length == 0 ? [get(cwd)] : args;

    let all: [string, VFSEntry[]][] = [];

    for (const item of args) {
        const fullPath = item.startsWith("/")
            ? path.normalize(item)
            : path.normalize(get(cwd) + "/" + item);

        all.push([fullPath, vfs.readdir(fullPath) ?? []]);
    }

    for (let i = 0; i < all.length; i++) {
        const [item, data] = all[i];

        println(`\x1b[96m${item}:\x1b[0m`);

        for (const file of data) {
            const designator =
                file.type == "file"
                    ? "-"
                    : file.type == "folder"
                      ? "d"
                      : file.type == "symlink" || file.type == "symlink-broken"
                        ? "l"
                        : "!";

            const prefixText = `${designator}${printPermissions(file.permissions)} ${file.owner} ${file.group}`;

            // TODO: Arguments (-l, -a)
            const prefix = `${prefixText} `;

            if (file.type == "folder") {
                println(`\x1b[37m${prefix}\x1b[95m${file.name}\x1b[0m`);
            } else if (file.type == "symlink") {
                println(`\x1b[37m${prefix}\x1b[92m${file.name}\x1b[0m`);
            } else if (file.type == "symlink-broken") {
                println(`\x1b[37m${prefix}\x1b[91m${file.name}\x1b[0m`);
            } else {
                println(`\x1b[37m${prefix}\x1b[94m${file.name}\x1b[0m`);
            }
        }

        if (i != all.length - 1) {
            println();
        }
    }
};

const cd = (args: string[]) => {
    const to = args.length >= 1 ? args[0] : "/";

    const fullTo = to.startsWith("/")
        ? to
        : path.normalize(`${get(cwd)}/${to}`);

    cwd.set(fullTo);
};

const cat = (args: string[]) => {
    let all: [string, string][] = [];

    for (const item of args) {
        const fullPath = path.normalize(get(cwd) + "/" + item);
        const file = vfs.read(fullPath);

        if (!file) {
            logError(`Failed to read file at ${fullPath}!`);
            continue;
        }

        all.push([item, new TextDecoder().decode(file.contents)]);
    }

    for (const [name, data] of all) {
        println(`\x1b[32m${name}:\x1b[0m`);
        println(`\x1b[34m${data}\x1b[0m`);
        println();
    }
};

const touch = (args: string[]) => {
    for (const item of args) {
        const fullPath = path.normalize(get(cwd) + "/" + item);
        const info = vfs.stat(fullPath);

        if (info.exists) {
            logError(`File at ${fullPath} already exists!`);
            continue;
        }

        vfs.create(fullPath);
    }
};

const rm = (args: string[]) => {
    for (const item of args) {
        if (item.startsWith("-")) continue;

        const fullPath = path.normalize(get(cwd) + "/" + item);

        if (fullPath == "/") {
            if (args.includes("--no-preserve-root")) {
                vfs.removeTree(fullPath);
            } else {
                logError(
                    "You are about to remove your \x1b[0m\x1b[1;91mENTIRE\x1b[0m\x1b[31m filesystem! If you are \x1b[0m\x1b[1;91mabsolutely\x1b[0m\x1b[31m sure, run again with --no-preserve-root."
                );
                continue;
            }

            return;
        }

        const info = vfs.stat(fullPath);

        if (!info.exists) {
            logError(`Entry at ${fullPath} does not exist!`);
            continue;
        }

        if (info.type == "folder") {
            if (args.includes("-r")) {
                vfs.removeTree(fullPath);
            } else {
                logError(`Entry at ${fullPath} is a directory! Cannot remove!`);
                continue;
            }
        } else {
            vfs.remove(fullPath);
        }
    }
};

const pwd = () => {
    println(get(cwd));
};

const reset = () => {
    vfs.reset();
    clear();
};

intrinsicCommands.set("clear", clear);
intrinsicCommands.set("cls", clear);
intrinsicCommands.set("ls", ls);
intrinsicCommands.set("cd", cd);
intrinsicCommands.set("cat", cat);
intrinsicCommands.set("pwd", pwd);
intrinsicCommands.set("touch", touch);
intrinsicCommands.set("rm", rm);
intrinsicCommands.set("reset", reset);
