#!/proc/builtin swc

import { process } from "$$/system/core";
import { println } from "$$/system/fmt";

process.argv.shift(); // remove the command

println(process.argv.join(" "));
