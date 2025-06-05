#!/proc/builtin swc

import { vfs, process, exit, cwd } from "$$/system/core";
import { logError, println } from "$$/system/fmt";
import * as path from "@std/path";

const proc = process.argv.shift();
let perms = 0o755;
let recursive = false;

if (process.argv.length <= 0) {
    println(`Usage: ${proc} [-p|--parents] [-m|--mode=<perms>] [dirs...]`);
}

const args = process.argv.filter((it) => {
    if (it == "-p" || it == "--parents") {
        recursive = true;
        return false;
    } else {
        return true;
    }
});

const flagIndex = args.indexOf("-m");

if (flagIndex != -1) {
    args.splice(flagIndex, 1); // remove the flag
    const [val] = args.splice(flagIndex, 1); // get the value

    try {
        perms = parseInt(val, 8);
    } catch (_ex: unknown) {
        logError("Invalid permissions bitmask!");
        exit(1);
    }
}

const setter = args.find((v) => v.startsWith("--mode="));

if (setter) {
    const setterIndex = args.indexOf(setter);

    if (setterIndex != -1) {
        const [flag] = args.splice(setterIndex, 1);
        const [_, val] = flag.split("=");

        try {
            perms = parseInt(val, 8);
        } catch (_ex: unknown) {
            logError("Invalid permissions bitmask!");
            exit(1);
        }
    }
}

for (const item of args) {
    if (recursive) {
        vfs.mkdirs(
            path.resolve(item.startsWith("/") ? item : `${cwd}/${item}`),
            perms
        );
    } else {
        vfs.mkdir(
            path.resolve(item.startsWith("/") ? item : `${cwd}/${item}`),
            perms
        );
    }
}
