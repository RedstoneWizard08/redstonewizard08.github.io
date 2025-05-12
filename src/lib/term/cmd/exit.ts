#!/proc/builtin swc

import { exit, process } from "$$/system/core";
import { logError } from "$$/system/fmt";

process.argv.shift();

const code = process.argv.shift()!.trim();

try {
    const parsed = parseInt(code);

    if (Number.isNaN(parsed)) throw new Error();

    exit(parsed);
} catch (err: unknown) {
    if ("code" in (err as any)) throw err;

    logError(`Error: Could not parse int: ${code}`);
    exit(1);
}
