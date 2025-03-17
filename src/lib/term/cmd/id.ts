#!/proc/builtin swc

import { gid, process, uid } from "$$/system/core";
import { println } from "$$/system/fmt";

if (process.argv.includes("-u")) {
    println(uid.toString());
} else if (process.argv.includes("-g")) {
    println(gid.toString());
} else {
    println("Usage: id [-u] [-g]");
}
