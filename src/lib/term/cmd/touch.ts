#!/proc/builtin swc

import * as path from "@std/path";
import { cwd, process, vfs } from "$$/system/core";
import { logError } from "$$/system/fmt";

process.argv.shift(); // remove the command

for (const item of process.argv) {
    const fullPath = path.normalize(cwd + "/" + item);
    const info = vfs.stat(fullPath);

    if (info.exists) {
        logError(`File at ${fullPath} already exists!`);
        continue;
    }

    vfs.create(fullPath);
}
