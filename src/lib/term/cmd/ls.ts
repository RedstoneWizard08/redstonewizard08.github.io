#!/proc/builtin swc

import * as path from "@std/path";
import { cwd, process, vfs } from "$$/system/core";
import { logError, println } from "$$/system/fmt";
import type { VFSEntry } from "$$/system/vfs";
import { printPermissions } from "$$/system/permissions";

process.argv.shift(); // remove the first arg (the command itself)

const flags = Object.fromEntries(
    new Set(
        process.argv
            .filter((v) => v.startsWith("-"))
            .flatMap((v) => v.replace("-", "").split(""))
    )
        .values()
        .map((v) => [v, true])
);

const extraInfo = flags.l;
const showAll = flags.a;
const newArgs = process.argv.filter((v) => !v.startsWith("-"));
const args = newArgs.length == 0 ? [cwd] : newArgs;
const all: [string, VFSEntry[]][] = [];

for (const item of args) {
    const fullPath = item.startsWith("/")
        ? path.normalize(item)
        : path.normalize(cwd + "/" + item);

    if (!vfs.exists(fullPath)) {
        logError(`Folder at ${fullPath} does not exist!`);
        continue;
    }

    const info = vfs.stat(fullPath);

    if (
        info.exists &&
        info.type != "folder" &&
        !(info.type == "symlink" && info.kind == "folder")
    ) {
        logError(`Entry at ${fullPath} is not a directory!`);
        continue;
    }

    const dirInfo = info as VFSEntry;

    const entries: VFSEntry[] = [
        ...(vfs.readdir(fullPath) ?? []),
        {
            name: ".",
            group: dirInfo.group,
            owner: dirInfo.owner,
            permissions: dirInfo.permissions,
            type: "folder",
        },
    ];

    const parentInfo = vfs.stat(path.normalize(fullPath + "/.."));

    if (parentInfo.exists && parentInfo.type == "folder") {
        entries.push({
            name: "..",
            group: parentInfo.group,
            owner: parentInfo.owner,
            permissions: parentInfo.permissions,
            type: "folder",
        });
    }

    all.push([fullPath, entries]);
}

for (let i = 0; i < all.length; i++) {
    const [item, data] = all[i];

    if (all.length > 1) println(`\x1b[96m${item}:\x1b[0m`);

    data.sort((a, b) => a.name.localeCompare(b.name));

    const maxOwner = Math.max(...data.map((it) => it.owner.toString().length));
    const ownerHasNegative = data.some((it) => it.owner < 0);
    const maxGroup = Math.max(...data.map((it) => it.group.toString().length));
    const groupHasNegative = data.some((it) => it.group < 0);

    for (const file of data) {
        if (file.name.startsWith(".") && !showAll) continue;

        const designator =
            file.type == "file"
                ? "-"
                : file.type == "folder"
                  ? "d"
                  : file.type == "symlink" || file.type == "symlink-broken"
                    ? "l"
                    : "!";

        const prefixText = `${designator}${printPermissions(
            file.permissions
        )} ${
            (ownerHasNegative && file.owner > 0 ? " " : "") +
            file.owner
                .toString()
                .padEnd(maxOwner - (ownerHasNegative ? 1 : 0), " ")
        } ${
            (groupHasNegative && file.group > 0 ? " " : "") +
            file.group
                .toString()
                .padEnd(maxGroup - (groupHasNegative ? 1 : 0), " ")
        }`;

        const prefix = extraInfo ? `${prefixText} ` : "";

        if (file.type == "folder") {
            println(`\x1b[37m${prefix}\x1b[95m${file.name}\x1b[0m`);
        } else if (file.type == "symlink") {
            println(`\x1b[37m${prefix}\x1b[92m${file.name}\x1b[0m`);
        } else if (file.type == "symlink-broken") {
            println(`\x1b[37m${prefix}\x1b[91m${file.name}\x1b[0m`);
        } else {
            println(`\x1b[37m${prefix}\x1b[94m${file.name}\x1b[0m`);
        }
    }

    if (i != all.length - 1) {
        println();
    }
}
