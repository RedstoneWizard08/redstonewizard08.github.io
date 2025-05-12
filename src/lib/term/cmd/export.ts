#!/proc/builtin swc

import { env, process } from "$$/system/core";

process.argv.shift(); // remove the cmd

const [name, val] = process.argv.shift()!.split("=");

env.set(name, val);
