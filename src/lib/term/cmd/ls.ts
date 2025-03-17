#!/proc/builtin swc

import * as path from "@std/path";
import { cwd, process, vfs } from "$$/system/core";
import { println } from "$$/system/fmt";
import type { VFSEntry } from "$$/system/vfs";
import { printPermissions } from "$$/system/permissions";

const main = async () => {
    process.argv.shift(); // remove the first arg (the command itself)

    const args = process.argv.length == 0 ? [cwd] : process.argv;

    let all: [string, VFSEntry[]][] = [];

    for (const item of args) {
        const fullPath = item.startsWith("/")
            ? path.normalize(item)
            : path.normalize(cwd + "/" + item);

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

main();
