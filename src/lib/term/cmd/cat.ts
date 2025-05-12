#!/proc/builtin swc

import { cwd, process, vfs } from "$$/system/core";
import { logError, println } from "$$/system/fmt";
import * as path from "@std/path";
import { highlight } from "cli-highlight";

const main = () => {
    process.argv.shift(); // remove the program name

    const all: [string, string][] = [];

    for (const item of process.argv) {
        const fullPath = item.startsWith("/")
            ? path.normalize(item)
            : path.normalize(cwd + "/" + item);

        if (!vfs.exists(fullPath)) {
            logError(`File at ${fullPath} does not exist!`);
            continue;
        }

        const file = vfs.read(fullPath);

        if (!file) {
            logError(`Failed to read file at ${fullPath}!`);
            continue;
        }

        all.push([
            item,
            new TextDecoder().decode(file.contents).replaceAll("\n", "\r\n"),
        ]);
    }

    for (const [name, data] of all) {
        println(`\x1b[92m${name}:\x1b[0m`);
        println(highlight(data).replaceAll("\n", "\r\n"));
        println();
    }
};

try {
    main();
} catch (e: any) {
    logError(e.message);
}
