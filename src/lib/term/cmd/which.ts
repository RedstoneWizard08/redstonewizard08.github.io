#!/proc/builtin swc

import { vfs, env, process, exit } from "$$/system/core";
import { println } from "$$/system/fmt";
import * as path from "@std/path";

const pathEnv = env.get("PATH")!.split(":");
const proc = process.argv.shift(); // remove the first arg, the command

let quiet = false;

const args = process.argv.filter((v) => {
    if (v == "-q" || v == "--quiet") {
        quiet = true;
        return false;
    } else if (v == "-h" || v == "--help") {
        println(`Usage: ${proc} [-q|--quiet] [-h|--help]`);
        exit(0);
        return false;
    } else {
        return true;
    }
});

for (const find of args) {
    if (find.startsWith("-")) continue;

    if (find.startsWith("/")) {
        if (vfs.exists(path.resolve(find))) {
            println(`${quiet ? "" : `${find}: `}${path.resolve(find)}`);
        } else {
            println(`${quiet ? "" : `${find}: `}Not found.`);
        }
    } else {
        let found = false;

        for (const dir of pathEnv) {
            if (!vfs.exists(dir)) continue;

            const files = vfs.readdir(dir);
            const file = files.find((v) => v.name == find);

            if (file) {
                found = true;
                println(`${quiet ? "" : `${find}: `}${dir}/${file.name}`);
                break;
            }
        }

        if (!found) {
            println(`${quiet ? "" : `${find}: `}Not found.`);
        }
    }
}
