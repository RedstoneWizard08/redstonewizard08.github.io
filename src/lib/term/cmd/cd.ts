#!/proc/builtin swc

import * as path from "@std/path";
import { chdir, cwd, process, vfs } from "$$/system/core";
import { logError } from "$$/system/fmt";

process.argv.shift(); // remove the command

const to = process.argv.length >= 1 ? process.argv[0] : "/";
const fullTo = to.startsWith("/") ? to : path.normalize(`${cwd}/${to}`);

if (vfs.exists(fullTo)) {
    chdir(fullTo);
} else {
    logError(`ENOENT: Directory does not exist: ${fullTo}`);
}
