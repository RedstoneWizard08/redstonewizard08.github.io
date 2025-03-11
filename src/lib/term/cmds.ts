import { get, writable } from "svelte/store";
import { termContent } from "../stores";
import { VirtualFS, type VFSEntry } from "./fs";
import * as path from "@std/path";
import { htmlText, styled } from "./util";

export type CommandExecutor = (args: string[]) => void | Promise<void>;

export const intrinsicCommands: Map<string, CommandExecutor> = new Map();
export const vfs = new VirtualFS();
export const cwd = writable<string>("/");

export const println = (data: string) => {
    termContent.update((v) => v + data + "<br />");
};

const clear = () => {
    termContent.set("");
};

const ls = (args: string[]) => {
    args = args.length == 0 ? [get(cwd)] : args;

    let all: [string, VFSEntry[]][] = [];

    for (const item of args) {
        const fullPath = item.startsWith("/")
            ? path.normalize(item)
            : path.normalize(get(cwd) + "/" + item);

        all.push([fullPath, vfs.readdir(fullPath) ?? []]);
    }

    for (const [item, data] of all) {
        println(styled("color-green", htmlText(item + ":")));

        for (const file of data) {
            if (file.type == "folder") {
                println(styled("color-purple", htmlText("  " + file.name)));
            } else {
                println(styled("color-blue", htmlText("  " + file.name)));
            }
        }

        println("");
    }
};

const cd = (args: string[]) => {
    const to = args.length >= 1 ? args[0] : "/";

    const fullTo = to.startsWith("/")
        ? to
        : path.normalize(`${get(cwd)}/${to}`);

    cwd.set(fullTo);
};

const cat = (args: string[]) => {
    let all: [string, string][] = [];

    for (const item of args) {
        const fullPath = path.normalize(get(cwd) + "/" + item);
        const file = vfs.read(fullPath);

        if (!file) {
            println(
                styled(
                    "color-red",
                    htmlText(`Failed to read file at ${fullPath}!`)
                )
            );
            continue;
        }

        all.push([item, new TextDecoder().decode(file.contents)]);
    }

    for (const [name, data] of all) {
        println(styled("color-green", htmlText(name + ":")));
        println(styled("color-blue", htmlText(data)));
        println("");
    }
};

const touch = (args: string[]) => {
    for (const item of args) {
        const fullPath = path.normalize(get(cwd) + "/" + item);
        const info = vfs.stat(fullPath);

        if (info.exists) {
            println(
                styled(
                    "color-red",
                    htmlText(`File at ${fullPath} already exists!`)
                )
            );
            continue;
        }

        vfs.create(fullPath);
    }
};

const rm = (args: string[]) => {
    for (const item of args) {
        if (item.startsWith("-")) continue;

        const fullPath = path.normalize(get(cwd) + "/" + item);

        if (fullPath == "/") {
            if (args.includes("--no-preserve-root")) {
                vfs.removeTree(fullPath);
            } else {
                println(
                    styled(
                        "color-red",
                        "You are about to remove your <b>ENTIRE</b> filesystem! If you are <b>absolutely</b> sure, run again with --no-preserve-root."
                    )
                );
                continue;
            }

            return;
        }

        const info = vfs.stat(fullPath);

        if (!info.exists) {
            println(
                styled(
                    "color-red",
                    htmlText(`Entry at ${fullPath} does not exist!`)
                )
            );
            continue;
        }

        if (info.type == "folder") {
            if (args.includes("-r")) {
                vfs.removeTree(fullPath);
            } else {
                println(
                    styled(
                        "color-red",
                        htmlText(
                            `Entry at ${fullPath} is a directory! Cannot remove!`
                        )
                    )
                );
                continue;
            }
        } else {
            vfs.remove(fullPath);
        }
    }
};

const pwd = () => {
    println(get(cwd));
};

intrinsicCommands.set("clear", clear);
intrinsicCommands.set("cls", clear);
intrinsicCommands.set("ls", ls);
intrinsicCommands.set("cd", cd);
intrinsicCommands.set("cat", cat);
intrinsicCommands.set("pwd", pwd);
intrinsicCommands.set("touch", touch);
intrinsicCommands.set("rm", rm);
