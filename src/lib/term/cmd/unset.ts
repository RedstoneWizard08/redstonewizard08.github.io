#!/proc/builtin swc

import { env, process } from "$$/system/core";

process.argv.shift(); // remove the command

for (const name of process.argv) {
    env.delete(name);
}
