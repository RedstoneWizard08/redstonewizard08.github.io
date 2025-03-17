#!/proc/builtin swc

import * as path from "@std/path";
import { cwd, process, vfs } from "$$/system/core";
import { logError } from "$$/system/fmt";

process.argv.shift(); // remove the command

const main = async () => {
    for (const item of process.argv) {
        if (item.startsWith("-")) continue;

        const fullPath = path.normalize(cwd + "/" + item);

        if (fullPath == "/") {
            if (process.argv.includes("--no-preserve-root")) {
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
            if (process.argv.includes("-r")) {
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

main();
