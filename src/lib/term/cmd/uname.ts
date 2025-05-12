#!/proc/builtin swc

import { machineInfo, process } from "$$/system/core";
import { println } from "$$/system/fmt";

process.argv.shift(); // remove the command

if (process.argv.includes("-h")) {
    println("Usage: uname [-a|-m]");
} else if (process.argv.includes("-a")) {
    println(machineInfo);
} else if (process.argv.includes("-m")) {
    println("js");
} else {
    println(machineInfo.split(" ")[0]);
}
